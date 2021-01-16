const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    Subj: { type: String },
    CRS: { type: Number },
    Cmp: { type: String },
    Sctn: { type: String },
    Days: { type: String },
    'Start Time': { type: String },
    'End Time': { type: String },
    'Mtg Start Date': { type: String },
    'Mtg End Date': { type: String },
    Duration: { type: Number },
    'Instruction Mode': { type: String },
    Building: { type: String },
    Room: { type: String },
    Instr: { type: String },
    'Enrl Cap': { type: Number },
    'Wait Cap': { type: Number },
    'Cmbnd Descr': { type: String },
    'Cmbnd Enrl Cap': { type: String },
    'credits': { type: String },
    'prerequisites': { type: String },
    'name': { type: String },
    'description': { type: String }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;