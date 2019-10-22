const log = require('winston');
var ctrls = require('../controllers');
var models = require('../models');

module.exports = {
    /**
     * Validates schema before creating a classroom
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateCreate: (req, res, next) => {
        log.info('Module - ValidateCreate Classroom');

        // Validate schema
        log.info('Validating classroom model...')
        var classroom = new models.classrooms(req.body);
        var error = classroom.validateSync();

        if (error) {
            log.error('classroom model validation failed!');
            let err = new Error('Classroom Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error));
            next(err);
            return;
        }

        log.info('Classroom model has been validated!');
        next();
    },
    /**
     * Creates a classroom
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with newly created classroom document
     */
    create: (req, res, next) => {
        log.info('Module - Create Classroom');
        var classroom = new models.classrooms(req.body);
        ctrls.mongodb.save(classroom, (err, classroomData) => {
            if (err) {
                let err = new Error('Failed creating classroom!');
                err.status = 500;
                next(err);
                return;
            }
            ctrls.mongodb.findById(models.teachers, classroomData.teacher, (err, teacherData) => {
                //TODO: figure out how to properly handle error
                if (err) {
                    log.error('Failled adding classroom to teacher [' + classroomData.teacher + ']');
                    return;
                }
                log.info('Successfully found teacher [' + classroomData.teacher + ']');

                log.info('Adding classroom to teacher');
                teacherData.classrooms.push(classroomData._id);

                ctrls.mongodb.save(teacherData, (err, _result) => {
                    //TODO: figure out how to properly handle error
                    if (err) {
                        log.error('Failled adding classroom to teacher [' + classroomData.teacher + ']');
                        return;
                    }
                    log.info('Successfully added teacher to classroom');
                });
            });

            for (let i = 0; i < classroomData.students.length; i++) {
                ctrls.mongodb.findById(models.students, classroomData.students[i], (err, studentData) => {
                    //TODO: figure out how to properly handle error
                    if (err) {
                        log.error('Failled adding classroom to student [' + classroomData.students[i] + ']');
                        return;
                    }
                    log.info('Successfully found student [' + classroomData.students[i] + ']');

                    log.info('Adding classroom to student');
                    studentData.classrooms.push(classroomData._id);

                    ctrls.mongodb.save(studentData, (err, _result) => {
                        //TODO: figure out how to properly handle error
                        if (err) {
                            log.error('Failled adding classroom to student [' + classroomData.students[i] + ']');
                            return;
                        }

                        log.info('Successfully added student [' + classroomData.students[i] + '] to classroom');
                    });
                });
            }

            log.info('Successfully created classroom');
            res.locals = classroomData;
            next();
        });
    },
    /**
     * Gets all classrooms
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with array of all classrooms documents
     */
    getAll: (req, res, next) => {
        log.info('Module - GetAll Classrooms');
        ctrls.mongodb.find(models.classrooms, {}, (err, results) => {
            if (err) {
                let err = new Error('Failed getting all classrooms!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found all classrooms.');
            res.locals = results;
            next();
        });
    },
    /**
     * Validates path id parameter
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validatePathId: (req, res, next) => {
        log.info('Module - validatePathId Classrooms');

        log.info('Validating request...');
        if (!req.params.id) {
            log.error('Request validation failed');
            let err = new Error('Missing required id parameter in the request path. (/classrooms/:id)');
            err.status = 400;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.params.id)) {
            log.error('Request validation failed');
            let err = new Error('Invalid id parameter in the request path.');
            err.status = 400;
            next(err);
            return;
        }

        log.info('Request validated!');
        next();
    },
    /**
     * Gets a classroom
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with classroom document
     */
    getOne: (req, res, next) => {
        log.info('Module - GetOne Classroom');
        ctrls.mongodb.findById(models.classrooms, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
    /**
     * Deletes a classroom
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with deletion result
     */
    deleteOne: (req, res, next) => {
        log.info('Module - DeleteOne Classrooms');
        ctrls.mongodb.findByIdAndRemove(models.classrooms, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed deleting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully deleted classroom [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },

    /**
     * Validates path quizId parameter
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateQuizId: (req, res, next) => {
        log.info('Module - validateQuizId Classrooms');

        log.info('Validating request...');
        if (!req.params.quizId) {
            log.error('Request validation failed');
            let err = new Error('Missing required quiz id parameter in the request path.');
            err.status = 400;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.params.quizId)) {
            log.error('Request validation failed');
            let err = new Error('Invalid quiz id parameter in the request path.');
            err.status = 400;
            next(err);
            return;
        }

        log.info('Quiz Id Request validated!');
        next();
    },

    /**
     * Validates schema before creating a quiz
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateQuizCreation: (req, res, next) => {
        log.info('Module - validateQuizCreation Classrooms');

        // Validate schema
        log.info('Validating quiz model...')
        var quiz = new models.quizzes(req.body);
        var error = quiz.validateSync();

        if (error) {
            log.error('Quiz model validation failed!');
            let err = new Error('Quiz Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error));
            next(err);
            return;
        }

        log.info('Quiz model has been validated!');
        next();
    },

    /**
     * Creates a Quiz
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    createQuiz: (req, res, next) => {
        log.info('Module - createQuiz Classrooms');

        var quiz = new models.quizzes(req.body);
        ctrls.mongodb.findById(models.classrooms, req.params.id, (err, classroom) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');

            log.info('Creating Quiz for classroom [' + req.params.id + ']');
            ctrls.mongodb.save(quiz, (err, result) => {
                if (err) {
                    let err = new Error('Error creating quiz for classroom [' + req.params.id + ']');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Successfully created quiz');
                res.locals = result;

                log.info('Adding quiz [' + result._id + '] to classroom [' + classroom._id + ']');
                classroom.quizHistory.push(result._id);

                ctrls.mongodb.save(classroom, (err, _result) => {
                    if (err) {
                        let err = new Error('Failed adding quiz [' + result._id + '] to classroom [' + classroom._id + ']');
                        err.status = 500;
                        next(err);
                        return;
                    }

                    log.info('Succesfully added quiz [' + result._id + '] to classroom [' + classroom._id + ']');
                    next();
                });
            });
        });
    },
    /**
     * Gets all classroom quizzes
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    getAllQuizzes: (req, res, next) => {
        log.info('Module - getAllQuizzes Classrooms');
        let populators = [{
            path: 'quizHistory'
        }];
        ctrls.mongodb.findByIdAndPopulate(models.classrooms, req.params.id, populators, (err, classroom) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');
            res.locals = classroom.quizHistory;
            next();
        });
    },
    /**
     * Gets all active classroom quizzes
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    getAllActiveQuizzes: (req, res, next) => {
        log.info('Module - getAllQuizzes Classrooms');
        let populators = [{
            path: 'quizHistory'
        }];
        ctrls.mongodb.findByIdAndPopulate(models.classrooms, req.params.id, populators, (err, classroom) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');
            log.info('Filtering out non activated quizzes');
            let quizzes = [];
            for (let i = 0; i < classroom.quizHistory.length; i++) {
                if (classroom.quizHistory[i].activated) {
                    quizzes.push(classroom.quizHistory[i]);
                }
            }
            res.locals = quizzes;
            next();
        });
    },
    /**
     * Validates schema before starting an attendance
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateAttendanceCreation: (req, res, next) => {
        log.info('Module - validateAttendanceCreation Classrooms');

        // Validate schema
        log.info('Validating attendance model...');

        // If empty no validation needed
        if (!req.body || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) {
            log.info('Attendance model has been validated!');
            next();
            return;
        }

        let attendance;
        let error;
        try {
            attendance = new models.attendance(req.body);
            error = attendance.validateSync();
        } catch (error) {
            log.error('Attendance validation Failed!');
            log.info(req.body)
            let err = new Error('Attendance Validation Failed!');
            err.status = 500;
            next(err);
            return;
        }

        if (error) {
            log.error('Attendance model validation failed!');
            let err = new Error('Attendance Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error));
            next(err);
            return;
        }

        log.info('Attendance model has been validated!');
        next();
    },
    /**
     * Creates an Attendance
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    createAttendance: (req, res, next) => {
        log.info('Module - createAttendance Classrooms');

        var attendance = (!req.body || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) ?
            new models.attendances({
                classroom: req.params.id
            }) : new models.attendances(req.body);

        ctrls.mongodb.findById(models.classrooms, req.params.id, (err, classroom) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');

            log.info('Creating attendance for classroom [' + req.params.id + ']');
            ctrls.mongodb.save(attendance, (err, result) => {
                if (err) {
                    let err = new Error('Error creating attendance for classroom [' + req.params.id + ']');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Successfully created attendance');
                res.locals = result;

                log.info('Adding attendance [' + result._id + '] to classroom [' + classroom._id + ']');
                classroom.attendanceHistory.push(result._id);

                ctrls.mongodb.save(classroom, (err, _result) => {
                    if (err) {
                        let err = new Error('Failed adding attendance [' + result._id + '] to classroom [' + classroom._id + ']');
                        err.status = 500;
                        next(err);
                        return;
                    }

                    log.info('Succesfully added attendance [' + result._id + '] to classroom [' + classroom._id + ']');
                    next();
                });
            });
        });
    },
    /**
     * Stops attendance
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    stopAttendance: (req, res, next) => {
        log.info('Module - stopAttendance Classrooms');
        let populators = [{
            path: 'presences.student',
            model: 'Students'
        }];
        ctrls.mongodb.findByIdAndPopulate(models.attendances, req.params.attendanceId, populators, (err, attendance) => {
            if (err) {
                let err = new Error('Failed getting attendance: ' + req.params.attendanceId);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found attendance [' + req.params.attendanceId + ']');
            attendance.activated = false;
            res.locals = attendance;
            ctrls.mongodb.save(attendance, (err, _result) => {
                if (err) {
                    let err = new Error('Failed stoping attendance!');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Succesfully stopped attendance [' + req.params.attendanceId + ']');
                next();
            });
        });
    },
    /**
     * Start attendance
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    startAttendance: (req, res, next) => {
        log.info('Module - startAttendance Classrooms');
        let populators = [{
            path: 'presences.student',
            model: 'Students'
        }];
        ctrls.mongodb.findByIdAndPopulate(models.attendances, req.params.attendanceId, populators, (err, attendance) => {
            if (err) {
                let err = new Error('Failed getting attendance: ' + req.params.attendanceId);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found attendance [' + req.params.attendanceId + ']');
            attendance.activated = true;
            res.locals = attendance;
            ctrls.mongodb.save(attendance, (err, _result) => {
                if (err) {
                    let err = new Error('Failed starting attendance!');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Succesfully started attendance [' + req.params.attendanceId + ']');
                next();
            });
        });
    },
    /**
     * Gets all classroom attendances
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    getAllAttendances: (req, res, next) => {
        log.info('Module - getAllAttendances Classrooms');
        let populators = [{
            path: 'attendanceHistory',
            populate: {
                path: 'presences.student',
                model: 'Students'
            }
        }];
        ctrls.mongodb.findByIdAndPopulate(models.classrooms, req.params.id, populators, (err, classroom) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');
            res.locals = classroom.attendanceHistory;
            next();
        });
    },
    /**
     * Gets all classroom students
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    getAllStudents: (req, res, next) => {
        log.info('Module - getAllStudents Classrooms');
        let populators = [{
            path: 'students',
            populate: {
                path: 'classrooms',
                model: 'Classrooms'
            }
        }];
        ctrls.mongodb.findByIdAndPopulate(models.classrooms, req.params.id, populators, (err, classroom) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');
            res.locals = classroom.students;
            next();
        });
    },
    /**
     * Marks a student as present in the classroom for the active attendance
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    studentSignIn: (req, res, next) => {
        log.info('Module - studentSignIn Classrooms');
        let populators = [{
            path: 'attendanceHistory'
        }];
        ctrls.mongodb.findByIdAndPopulate(models.classrooms, req.params.id, populators, (err, classroom) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');
            //Find first active attendance
            let attendanceId;
            for (let i = 0; i < classroom.attendanceHistory.length; i++) {
                let attendance = classroom.attendanceHistory[i];
                // TODO: make sure date is today
                if (attendance.activated) {
                    // This is annoying but Mongoosse doesn't support the saving of populated doc
                    attendanceId = attendance._id;
                    break;
                }
            }

            if (!attendanceId) {
                let err = new Error('No active attendances for this classroom!');
                err.status = 404;
                next(err);
                return;
            }

            ctrls.mongodb.findById(models.attendances, attendanceId, (err, attendance) => {
                if (err) {
                    log.error('Failed getting attendace: [' + attendanceId + ']');
                    log.error('Failed sign in for student [' + req.params.studentId + ']');
                    return;
                }
                attendance.presences.push({
                    student: req.params.studentId,
                    present: true
                });
                ctrls.mongodb.save(attendance, (err, _result) => {
                    if (err) {
                        log.error('Failed getting attendace: [' + attendanceId + ']');
                        log.error('Failed sign in for student [' + req.params.studentId + ']');
                        return;
                    }

                    log.info('Student [' + req.params.studentId + '] has signed into to classroom [' + req.params.id + '] on attendance [' + attendanceId + ']');
                });
            });

            ctrls.mongodb.findById(models.students, req.params.studentId, (err, student) => {
                if (err) {
                    log.error('Failed getting student: [' + req.params.studentId + ']');
                    log.error('Failed sign in for student [' + req.params.studentId + ']');
                    return;
                }
                student.attendanceHistory.push(attendanceId);
                log.info('Student [' + req.params.studentId + '] attendance has been updated [' + attendanceId + ']');
                ctrls.mongodb.save(student, (err, _result) => {
                    if (err) {
                        log.error('Failed getting student: [' + req.params.studentId + ']');
                        log.error('Failed sign in for student [' + req.params.studentId + ']');
                        return;
                    }

                    log.info('Student [' + req.params.studentId + '] attendance has been updated [' + attendanceId + ']');
                });
            });

            res.locals = {
                accepted: true
            };
            next();
        });
    },
    /**
     * Verifies teacher identity based on JWT
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    verifyTeacher: (req, res, next) => {
        log.info('Module - verifyTeacher Classrooms');
        if (!req.auth) {
            log.error('Missing req.auth decoded token');
            let err = new Error('Invalid Token for authentication, forbidden');
            err.status = 403;
            next(err);
            return;
        }

        if (req.auth.type !== 'teacher') {
            log.error('Invalid user type in token');
            let err = new Error('Unauthorized! Only teachers can access this data!');
            err.status = 401;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.auth.id)) {
            log.error('Token id is not a valid Mongo DB id');
            let err = new Error('Invalid Token for authentication');
            err.status = 401;
            next(err);
            return;
        }

        ctrls.mongodb.findById(models.classrooms, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');

            if (!ctrls.mongodb.isEqual(req.auth.id, result.teacher)) {
                log.error('User is unauthorized to access this data.');
                let err = new Error('User is unauthorized to access this data.');
                err.status = 401;
                next(err);
                return;
            }

            log.info('Authorized');
            next();
        });
    },
    /**
     * Verifies identity teacher or student in classroom  based on JWT
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    verifyTeacherOrStudent: (req, res, next) => {
        log.info('Module - verifyTeacherOrStudent Classrooms');
        if (!req.auth) {
            log.error('Missing req.auth decoded token');
            let err = new Error('Invalid Token for authentication, forbidden');
            err.status = 403;
            next(err);
            return;
        }

        if (req.auth.type !== 'teacher' && req.auth.type !== 'student') {
            log.error('Invalid user type in token');
            let err = new Error('Invalid Token for authentication, forbidden');
            err.status = 403;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.auth.id)) {
            log.error('Token id is not a valid Mongo DB id');
            let err = new Error('Invalid Token for authentication');
            err.status = 401;
            next(err);
            return;
        }

        ctrls.mongodb.findById(models.classrooms, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting classroom: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found classroom [' + req.params.id + ']');


            if (req.auth.type === 'teacher') {
                if (!ctrls.mongodb.isEqual(req.auth.id, result.teacher)) {
                    log.error('User is unauthorized to access this data.');
                    let err = new Error('User is unauthorized to access this data.');
                    err.status = 401;
                    next(err);
                    return;
                }
            } else {
                if (result.students.indexOf(req.auth.id) < 0) {
                    log.error('User is unauthorized to access this data.');
                    let err = new Error('User is unauthorized to access this data.');
                    err.status = 401;
                    next(err);
                    return;
                }
            }
            log.info('Authorized');
            next();
        });
    }
};
