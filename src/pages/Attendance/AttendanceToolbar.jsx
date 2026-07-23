import { useEffect, useState } from "react";
import "./AttendanceToolbar.css"
import {
  getClasses,
} from "../../services/classService";

import {
  getDivisions,
} from "../../services/divisionService";

import {
  getStudentsByDivision,
} from "../../services/studentService";
function AttendanceToolbar({
  setStudents,
  setAttendance,

  classId,
  setClassId,

  divisionId,
  setDivisionId,

  date,
  setDate,
}) {

  const [classes, setClasses] =
  useState([]);

const [divisions, setDivisions] =
  useState([]);

  useEffect(() => {

    loadDropdowns();

  }, []);

  const loadDropdowns =
    async () => {

      try {

        const classRes =
          await getClasses();

        const divisionRes =
          await getDivisions();

        setClasses(
          classRes.data
        );

        setDivisions(
          divisionRes.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  const loadStudents =
  async () => {

    if (!divisionId) {

      return;

    }

    try {

      const res =
        await getStudentsByDivision(
          divisionId
        );

      const studentList = res.data;

setStudents(studentList);

setAttendance(

  studentList.map((student) => ({

    studentId: student._id,

    status: "present",

    remarks: "",

  }))

);

    } catch (error) {

      console.log(error);

    }

  };  

const filteredDivisions =
  divisions.filter(
    (division) =>
      division.classId?._id === classId
  );

  return (
  
  <div className="attendance-toolbar">

  <div className="attendance-toolbar-header">
    <h2 className="attendance-title">
      Attendance
    </h2>
  </div>

  <div className="attendance-toolbar-grid">

    <div className="toolbar-field">
      <label>Date</label>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    <div className="toolbar-field">
      <label>Class</label>

      <select
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      >
        <option value="">Select Class</option>

        {classes.map((singleClass) => (
          <option
            key={singleClass._id}
            value={singleClass._id}
          >
            {singleClass.name}
          </option>
        ))}
      </select>
    </div>

    <div className="toolbar-field">
      <label>Division</label>

      <select
        value={divisionId}
        onChange={(e) => setDivisionId(e.target.value)}
        disabled={!classId}
      >
        <option value="">
          Select Division
        </option>

        {filteredDivisions.map((division) => (
          <option
            key={division._id}
            value={division._id}
          >
            {division.name}
          </option>
        ))}
      </select>
    </div>

    <div className="toolbar-button">
      <button
        className="attendance-load-btn btn-press"
        onClick={loadStudents}
      >
        <span className="material-symbols-outlined">
          sync
        </span>

        Load Students
      </button>
    </div>

  </div>

</div>);

}

export default AttendanceToolbar;