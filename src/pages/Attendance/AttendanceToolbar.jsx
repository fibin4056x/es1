import { useEffect, useState } from "react";

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

      <input
        type="date"
        value={date}
        onChange={(e) =>
        setDate(e.target.value)
        }

      />

      <select
        value={classId}
        onChange={(e) =>
          setClassId(
            e.target.value
          )
        }
      >

        <option value="">
          Select Class
        </option>

        {classes.map(
          (singleClass) => (

            <option
              key={
                singleClass._id
              }
              value={
                singleClass._id
              }
            >
              {singleClass.name}
            </option>

          )
        )}

      </select>

      <select
        value={
          divisionId
        }
        onChange={(e) =>
          setDivisionId(
            e.target.value
          )
        }
        disabled={!classId}
      >

        <option value="">
          Select Division
        </option>

        {filteredDivisions.map(
          (division) => (

            <option
              key={division._id}
              value={
                division._id
              }
            >
              {division.name}
            </option>

          )
        )}

      </select>
<button
  onClick={loadStudents}
>

Load Students

</button>

    </div>

  );

}

export default AttendanceToolbar;