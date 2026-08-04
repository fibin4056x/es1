import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getClasses } from "../../services/ClassService";
import { getDivisions } from "../../services/DivisionService";
import { createStudent, updateStudent } from "../../services/StudentService";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDropdowns = async () => {
      try {
        const [classRes, divisionRes] = await Promise.all([
          getClasses(),
          getDivisions(),
        ]);
        if (isMounted) {
          setClasses(classRes.data || []);
          setDivisions(divisionRes.data || []);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          toast.error("Failed to load classes or divisions.");
        }
      }
    };

    Promise.resolve().then(fetchDropdowns);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isEdit && student) {
      Promise.resolve().then(() => {
        setForm({
          admissionNumber: student.admissionNumber || "",
          admissionDate: student.admissionDate?.slice(0, 10) || "",
          nameEnglish: student.nameEnglish || "",
          nameMalayalam: student.nameMalayalam || "",
          gender: student.gender || "",
          dateOfBirth: student.dateOfBirth?.slice(0, 10) || "",
          classId: student.classId?._id || student.classId || "",
          divisionId: student.divisionId?._id || student.divisionId || "",
          bloodGroup: student.bloodGroup || "",
          parentName: student.parentName || "",
          parentPhone: student.parentPhone || "",
          guardianRelation: student.guardianRelation || "",
          address: student.address || "",
          aadhaarNumber: student.aadhaarNumber || "",
          economicCategory: student.economicCategory || "",
          status: student.status || "active",
        });
      });
    }
  }, [student, isEdit]);


  const filteredDivisions = divisions.filter(
    (division) =>
      (division.classId?._id || division.classId) === form.classId
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { divisionId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.admissionNumber.trim()) {
      toast.warning("Admission Number is required.");
      return;
    }
    if (!form.nameEnglish.trim()) {
      toast.warning("Student English Name is required.");
      return;
    }
    if (!form.classId) {
      toast.warning("Please select a Class.");
      return;
    }
    if (!form.divisionId) {
      toast.warning("Please select a Division.");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateStudent(student._id, form);
        toast.success("Student profile updated successfully.");
      } else {
        await createStudent(form);
        toast.success("Student profile created successfully.");
      }

      reload?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to save student profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="student-form-responsive" onSubmit={handleSubmit} noValidate>
      <div className="form-scrollable-body">
        {/* Section 1: Academic Information */}
        <div className="form-section-card">
          <div className="form-section-header">
            <span className="material-symbols-outlined section-icon">school</span>
            <h4>Academic Information</h4>
          </div>

          <div className="form-responsive-grid">
            <div className="form-group">
              <label htmlFor="admissionNumber">
                Admission Number <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined input-prefix-icon">badge</span>
                <input
                  id="admissionNumber"
                  type="text"
                  name="admissionNumber"
                  value={form.admissionNumber}
                  onChange={handleChange}
                  placeholder="e.g. ADM-2026-089"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admissionDate">
                Admission Date <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined input-prefix-icon">calendar_month</span>
                <input
                  id="admissionDate"
                  type="date"
                  name="admissionDate"
                  value={form.admissionDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="classId">
                Class <span className="required-star">*</span>
              </label>
              <select
                id="classId"
                name="classId"
                value={form.classId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="divisionId">
                Division <span className="required-star">*</span>
              </label>
              <select
                id="divisionId"
                name="divisionId"
                value={form.divisionId}
                onChange={handleChange}
                disabled={!form.classId || loading}
                required
              >
                <option value="">Select Division</option>
                {filteredDivisions.map((div) => (
                  <option key={div._id} value={div._id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="form-section-card">
          <div className="form-section-header">
            <span className="material-symbols-outlined section-icon">person</span>
            <h4>Personal Details</h4>
          </div>

          <div className="form-responsive-grid">
            <div className="form-group">
              <label htmlFor="nameEnglish">
                Student Name (English) <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined input-prefix-icon">account_circle</span>
                <input
                  id="nameEnglish"
                  type="text"
                  name="nameEnglish"
                  value={form.nameEnglish}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nameMalayalam">Student Name (Malayalam)</label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined input-prefix-icon">translate</span>
                <input
                  id="nameMalayalam"
                  type="text"
                  name="nameMalayalam"
                  value={form.nameMalayalam}
                  onChange={handleChange}
                  placeholder="വിദ്യാർത്ഥിയുടെ പേര്"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gender">
                Gender <span className="required-star">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">
                Date of Birth <span className="required-star">*</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                disabled={loading}
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
          </div>
        </div>

        {/* Section 3: Parent & Guardian Details */}
        <div className="form-section-card">
          <div className="form-section-header">
            <span className="material-symbols-outlined section-icon">family_restroom</span>
            <h4>Parent / Guardian Details</h4>
          </div>

          <div className="form-responsive-grid">
            <div className="form-group">
              <label htmlFor="parentName">
                Parent / Guardian Name <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined input-prefix-icon">face</span>
                <input
                  id="parentName"
                  type="text"
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="e.g. Robert Johnson"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="parentPhone">
                Parent Phone <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined input-prefix-icon">call</span>
                <input
                  id="parentPhone"
                  type="tel"
                  name="parentPhone"
                  value={form.parentPhone}
                  onChange={handleChange}
                  placeholder="10-digit Mobile Number"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guardianRelation">
                Relation <span className="required-star">*</span>
              </label>
              <select
                id="guardianRelation"
                name="guardianRelation"
                value={form.guardianRelation}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Relation</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">
                Residential Address <span className="required-star">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="2"
                placeholder="Enter complete house address, area, and pincode..."
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Government & Category */}
        <div className="form-section-card">
          <div className="form-section-header">
            <span className="material-symbols-outlined section-icon">verified_user</span>
            <h4>Government & Category</h4>
          </div>

          <div className="form-responsive-grid">
            <div className="form-group">
              <label htmlFor="aadhaarNumber">Aadhaar Number</label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined input-prefix-icon">fingerprint</span>
                <input
                  id="aadhaarNumber"
                  type="text"
                  name="aadhaarNumber"
                  value={form.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="12-digit Aadhaar Number"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="economicCategory">Economic Category</label>
              <select
                id="economicCategory"
                name="economicCategory"
                value={form.economicCategory}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option value="APL">Above Poverty Line (APL)</option>
                <option value="BPL">Below Poverty Line (BPL)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Account Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="modal-sticky-footer">
        <button
          type="button"
          className="cancel-btn btn-press"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="submit-btn btn-press"
          disabled={loading}
        >
          <span className="material-symbols-outlined">
            {loading ? "progress_activity" : isEdit ? "save" : "person_add"}
          </span>
          <span>{loading ? "Saving..." : isEdit ? "Update Student" : "Save Student"}</span>
        </button>
      </div>
    </form>
  );
}

export default StudentForm;