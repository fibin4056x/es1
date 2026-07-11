function RecentStudents() {

  const students=[
    "Arjun",
    "Rahul",
    "Akhil",
    "Anu",
    "Diya"
  ];

  return (

    <div
      style={{
        background:"#fff",
        borderRadius:"12px",
        padding:"25px",
        boxShadow:"0 4px 12px rgba(0,0,0,.08)"
      }}
    >

      <h2>Recent Students</h2>

      <br/>

      <table
        width="100%"
        cellPadding="12"
      >

        <thead>

          <tr>

            <th>Name</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {
            students.map((student,index)=>(

              <tr key={index}>

                <td>{student}</td>

                <td>Active</td>

              </tr>

            ))
          }

        </tbody>

      </table>

    </div>

  );

}

export default RecentStudents;