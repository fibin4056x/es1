function AttendanceRow({

  student,

  attendance,

  setAttendance,

}) {

  const currentAttendance =
    attendance.find(

      (item) =>

        item.studentId ===
        student._id

    );

  const handleChange = (value) => {

    setAttendance(

      attendance.map((item) =>

        item.studentId ===
        student._id

          ? {
              ...item,
              status: value,
            }

          : item

      )

    );

  };

  return (

    <tr>

      <td>

        {student.admissionNumber}

      </td>

      <td>

        {student.nameEnglish}

      </td>

      <td>

        <select

          value={
            currentAttendance?.status
          }

          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }

        >

          <option value="present">

            Present

          </option>

          <option value="absent">

            Absent

          </option>

          <option value="late">

            Late

          </option>

        </select>

      </td>

    </tr>

  );

}

export default AttendanceRow;