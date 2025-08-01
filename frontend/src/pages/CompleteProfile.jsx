// src/pages/CompleteProfile.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { usePlanPackages } from '../hooks/usePlan';

export default function CompleteProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { updateProfile, loading } = useUpdateProfile();
  const { data: planData, loading: plansLoading } = usePlanPackages();

  const plans = planData?.planPackages || [];

  const [form, setForm] = useState({
    name: state?.name || '',
    email: state?.email || '',
    password: state?.password || '',
    role: 'editor',
    phone: '',
    company: '',
    planPackageId: '',
  });

  // Set default plan to 'Pro' after plans are loaded
//   useEffect(() => {
//     if (!form.planPackageId && plans.length) {
//       const defaultPlan = plans.find(p => p.name === 'Pro');
//       if (defaultPlan) {
//         setForm((prev) => ({ ...prev, planPackageId: defaultPlan.id }));
//       }
//     }
//   }, [plans]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.planPackageId) {
      toast.error('Please select a plan to continue.');
      return;
    }

    try {
        const { name, phone, company, role, planPackageId } = form;

        await updateProfile({
            variables: {
            input: {
                name,
                phone,
                company,
                role,
                planPackageId,
            },
            },
        });
      toast.success('Profile completed!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h2 className="text-center mb-4" style={{ color: '#1F1F1F' }}>
            Complete Your Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input value={form.name} disabled className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input value={form.email} disabled className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-control"
                placeholder="(123) 456-7890"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Company</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="form-control"
                placeholder="Your Company"
              />
            </div>

            <div className="mb-4">
              <label className="form-label d-block">Choose Your Plan</label>
              {plansLoading ? (
                <p>Loading plans...</p>
              ) : (
                <div className="row">
                    {plans.map((plan) => {
                    const isSelected = String(form.planPackageId) === String(plan.id);
                    return (
                        <div key={plan._id || plan.name} className="col-md-4 mb-3">
                            <div
                                className={`card h-100 text-center transition shadow-sm border-2 ${
                                isSelected ? 'border-warning' : 'border-light'
                                }`}
                                onClick={() =>
                                setForm((prev) => ({ ...prev, planPackageId: plan.id }))
                                }
                                style={{
                                cursor: 'pointer',
                                borderColor: isSelected ? '#F4B942' : '#ddd',
                                backgroundColor: isSelected ? '#F7E9D7' : '#fff',
                                transition: 'all 0.3s ease-in-out',
                                }}
                            >
                                <div className="card-body">
                                <h5 className="card-title mb-2">{plan.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">
                                    ${plan.pricePerMonth}/mo
                                </h6>
                                <p className="card-text small">{plan.description}</p>
                                </div>
                                {isSelected && (
                                <div
                                    className="card-footer text-white fw-semibold py-2"
                                    style={{ backgroundColor: '#F4B942' }}
                                >
                                    Selected
                                </div>
                                )}
                            </div>
                        </div>
                    );
                    })}

                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-block w-100 text-white"
              style={{ backgroundColor: '#F4B942' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
