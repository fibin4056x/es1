function RecentTeachers() {

  const teachers=[
    "John",
    "David",
    "Michael",
    "Emma"
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

      <h2>Recent Teachers</h2>

      <br/>

      {
        teachers.map((teacher,index)=>(
          <p key={index}>
            {teacher}
          </p>
        ))
      }

    </div>

  );

}

export default RecentTeachers;