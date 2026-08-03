/* eslint-disable */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getClasses,
} from "../../services/classService";

import {
  getDivisions,
} from "../../services/divisionService";
import {
  createStudent,
  updateStudent,
} from "../../services/studentService";

function StudentForm({
  student,
  isEdit = false,
  onClose,
  reload,
}) {
  const [form, setForm] = useState({
    admissionNumber: "",
    admissionDate: "",

    nameEnglish: "",
    nameMalayalam: "",

    gender: "",
    dateOfBirth: "",

    classId: "",
    divisionId: "",

    bloodGroup: "",

    parentName: "",
    parentPhone: "",
    guardianRelation: "",

    address: "",

    aadhaarNumber: "",
    economicCategory: "",

    status: "active",
  });
   const [classes, setClasses] = useState([]);

const [divisions, setDivisions] = useState([]);

  const loadDropdowns = async () => {
  try {

    const classRes =
      await getClasses();

    const divisionRes =
      await getDivisions();

    setClasses(classRes.data);

    setDivisions(divisionRes.data);

  } catch (error) {

    console.log(error);

  }
};

useEffect(() => {
  loadDropdowns();
}, []);
  useEffect(() => {
    if (isEdit && student) {
      setForm({
        admissionNumber:
          student.admissionNumber || "",

        admissionDate:
          student.admissionDate?.slice(0, 10) || "",

        nameEnglish:
          student.nameEnglish || "",

        nameMalayalam:
          student.nameMalayalam || "",

        gender:
          student.gender || "",

        dateOfBirth:
          student.dateOfBirth?.slice(0, 10) || "",

        classId:
          student.classId?._id || "",

        divisionId:
          student.divisionId?._id || "",

        bloodGroup:
          student.bloodGroup || "",

        parentName:
          student.parentName || "",

        parentPhone:
          student.parentPhone || "",

        guardianRelation:
          student.guardianRelation || "",

        address:
          student.address || "",

        aadhaarNumber:
          student.aadhaarNumber || "",

        economicCategory:
          student.economicCategory || "",

        status:
          student.status || "active",
      });
    }
  }, [student, isEdit]);

  const filteredDivisions =
  divisions.filter(
    (division) =>
      division.classId?._id ===
      form.classId
  );
  const handleChange = (e) => {

  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,

    [name]: value,

    ...(name === "classId"
      ? { divisionId: "" }
      : {}),
  }));

};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateStudent(
          student._id,
          form
        );

        toast.success(
          "Student updated successfully"
        );
      } else {
        await createStudent(form);

        toast.success(
          "Student created successfully"
        );
      }

      reload();
      onClose();

    } catch (error) {
console.log(error.response?.data);

toast.error(
  error.response?.data?.message ||
  "Unable to create student"
);
    }
  };

  return (
  
  <form
    className="student-form"
    onSubmit={handleSubmit}
  >
<h3>Academic Information</h3>

<div className="form-group">

  <label>Admission Number</label>

  <input
    type="text"
    name="admissionNumber"
    value={form.admissionNumber}
    onChange={handleChange}
    placeholder="Admission Number"
    required
  />

</div>

<div className="form-group">

  <label>Admission Date</label>

  <input
    type="date"
    name="admissionDate"
    value={form.admissionDate}
    onChange={handleChange}
    required
  />

</div>

<div className="form-group">

  <label>Class</label>

  <select
    name="classId"
    value={form.classId}
    onChange={handleChange}
    required
  >
    <option value="">
      Select Class
    </option>

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

<div className="form-group">

  <label>Division</label>

 <select
  name="divisionId"
  value={form.divisionId}
  onChange={handleChange}
  disabled={!form.classId}
  required
>
    <option value="">
      Select Division
    </option>

  {filteredDivisions.map(
  (division) => (

    <option
      key={division._id}
      value={division._id}
    >
      {division.name}
    </option>

  )
)}
  </select>

</div>

     <h3>Student Information</h3>

<div className="form-group">
  <label>Student Name (English)</label>

  <input
    type="text"
    name="nameEnglish"
    value={form.nameEnglish}
    onChange={handleChange}
    placeholder="Student Name"
    required
  />
</div>

<div className="form-group">
  <label>Student Name (Malayalam)</label>

  <input
    type="text"
    name="nameMalayalam"
    value={form.nameMalayalam}
    onChange={handleChange}
    placeholder="വിദ്യാർത്ഥിയുടെ പേര്"
  />
</div>

<div className="form-group">
  <label>Gender</label>

  <select
    name="gender"
    value={form.gender}
    onChange={handleChange}
    required
  >
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>

<div className="form-group">
  <label>Date of Birth</label>

  <input
    type="date"
    name="dateOfBirth"
    value={form.dateOfBirth}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group">
  <label>Blood Group</label>

  <select
    name="bloodGroup"
    value={form.bloodGroup}
    onChange={handleChange}
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  </select>
</div>

    <h3>Parent / Guardian Information</h3>

<div className="form-group">
  <label>Parent Name</label>

  <input
    type="text"
    name="parentName"
    value={form.parentName}
    onChange={handleChange}
    placeholder="Parent Name"
    required
  />
</div>

<div className="form-group">
  <label>Parent Phone</label>

  <input
    type="text"
    name="parentPhone"
    value={form.parentPhone}
    onChange={handleChange}
    placeholder="10-digit Mobile Number"
    required
  />
</div>

<div className="form-group">
  <label>Guardian Relation</label>

  <select
    name="guardianRelation"
    value={form.guardianRelation}
    onChange={handleChange}
    required
  >
    <option value="">Select Relation</option>
    <option value="Father">Father</option>
    <option value="Mother">Mother</option>
    <option value="Guardian">Guardian</option>
  </select>
</div>

<div className="form-group full-width">
  <label>Address</label>

  <textarea
    name="address"
    value={form.address}
    onChange={handleChange}
    rows="3"
    placeholder="Student Address"
    required
  />
</div>

      <h3>Government Information</h3>

<div className="form-group">
  <label>Aadhaar Number</label>

  <input
    type="text"
    name="aadhaarNumber"
    value={form.aadhaarNumber}
    onChange={handleChange}
    placeholder="12-digit Aadhaar Number"
  />
</div>

<div className="form-group">
  <label>Economic Category</label>

  <select
    name="economicCategory"
    value={form.economicCategory}
    onChange={handleChange}
  >
    <option value="">Select Category</option>
    <option value="APL">APL</option>
    <option value="BPL">BPL</option>
  </select>
</div>

<div className="form-group">
  <label>Status</label>

  <select
    name="status"
    value={form.status}
    onChange={handleChange}
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>

<div className="modal-actions full-width">
  <button
    type="button"
    className="cancel-btn btn-press"
    onClick={onClose}
  >
    Cancel
  </button>

  <button
    type="submit"
    className="submit-btn btn-press"
  >
    {isEdit ? "Update Student" : "Save Student"}
  </button>
</div>

    </form>
  );
}

export default StudentForm;