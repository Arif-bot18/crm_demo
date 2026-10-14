"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { Lead } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  SOURCE_OPTIONS,
  COURSE_OPTIONS,
  PIPELINE_STAGES,
  COUNSELOR_OPTIONS,
  normalizePhoneNumber,
} from "@/lib/demo-data";
import { useLeads } from "@/context/leads-context";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
  onSuccess: (message: string) => void;
}

interface FormState {
  studentName: string;
  phone: string;
  email: string;
  course: string;
  source: string;
  campaignId?: string;
  campaignName: string;
  stage: string;
  counselor: string;
  nextFollowUp: string;
  notes: string;
}

interface FormErrors {
  studentName?: string;
  phone?: string;
  email?: string;
  course?: string;
  source?: string;
  stage?: string;
  counselor?: string;
  general?: string;
}

export function LeadFormModal({
  isOpen,
  onClose,
  leadToEdit,
  onSuccess,
}: LeadFormModalProps) {
  const { addLead, updateLead, isPhoneDuplicate, sources, campaigns } = useLeads();

  const isEditing = Boolean(leadToEdit);

  const initialFormState: FormState = {
    studentName: "",
    phone: "",
    email: "",
    course: COURSE_OPTIONS[0],
    source: sources[0]?.name || SOURCE_OPTIONS[0],
    campaignId: undefined,
    campaignName: "",
    stage: PIPELINE_STAGES[0],
    counselor: COUNSELOR_OPTIONS[0],
    nextFollowUp: "Tomorrow, 10:00 AM",
    notes: "",
  };

  const [form, setForm] = React.useState<FormState>(initialFormState);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [useCustomCampaign, setUseCustomCampaign] = React.useState(false);

  // Populate form if editing
  React.useEffect(() => {
    if (leadToEdit) {
      setForm({
        studentName: leadToEdit.studentName,
        phone: leadToEdit.phone,
        email: leadToEdit.email || "",
        course: leadToEdit.course || COURSE_OPTIONS[0],
        source: leadToEdit.source || sources[0]?.name || SOURCE_OPTIONS[0],
        campaignId: leadToEdit.campaignId,
        campaignName: leadToEdit.campaignName || "",
        stage: leadToEdit.stage || PIPELINE_STAGES[0],
        counselor: leadToEdit.counselor || COUNSELOR_OPTIONS[0],
        nextFollowUp: leadToEdit.nextFollowUp || "Tomorrow, 10:00 AM",
        notes: leadToEdit.notes || "",
      });
      setUseCustomCampaign(Boolean(leadToEdit.campaignName && !leadToEdit.campaignId));
      setErrors({});
    } else {
      setForm({
        ...initialFormState,
        source: sources[0]?.name || SOURCE_OPTIONS[0],
      });
      setUseCustomCampaign(false);
      setErrors({});
    }
  }, [leadToEdit, isOpen, sources]);

  const availableSources = React.useMemo(() => {
    if (sources && sources.length > 0) {
      return sources.filter((s) => s.isActive || s.name === form.source);
    }
    return SOURCE_OPTIONS.map((name) => ({
      id: name,
      name,
      isActive: true,
    }));
  }, [sources, form.source]);

  const currentSource = React.useMemo(() => {
    return sources.find(
      (s) => s.name.toLowerCase() === form.source.toLowerCase()
    );
  }, [sources, form.source]);

  const campaignsForSource = React.useMemo(() => {
    if (!currentSource) return [];
    return campaigns.filter(
      (c) =>
        c.sourceId === currentSource.id ||
        c.sourceName.toLowerCase() === form.source.toLowerCase()
    );
  }, [campaigns, currentSource, form.source]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: FormErrors = {};

    // 1. Student Name
    if (!form.studentName.trim()) {
      errs.studentName = "Student name is required.";
    } else if (form.studentName.trim().length < 2) {
      errs.studentName = "Student name must be at least 2 characters.";
    }

    // 2. Phone validation and normalization
    const cleanedPhone = normalizePhoneNumber(form.phone);
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (cleanedPhone.length !== 10) {
      errs.phone = "Please enter a valid 10-digit mobile number.";
    } else if (isPhoneDuplicate(form.phone, leadToEdit?.id)) {
      errs.phone = "A lead with this phone number already exists.";
    }

    // 3. Email validation if provided
    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    // 4. Course
    if (!form.course) {
      errs.course = "Please select a course.";
    }

    // 5. Source
    if (!form.source) {
      errs.source = "Please select a lead source.";
    }

    // 6. Stage
    if (!form.stage) {
      errs.stage = "Please select a pipeline stage.";
    }

    // 7. Counselor
    if (!form.counselor) {
      errs.counselor = "Please assign a counsellor.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && leadToEdit) {
        const res = updateLead(leadToEdit.id, {
          studentName: form.studentName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          course: form.course,
          source: form.source,
          campaignId: form.campaignId || undefined,
          campaignName: form.campaignName.trim() || undefined,
          stage: form.stage,
          counselor: form.counselor,
          nextFollowUp: form.nextFollowUp.trim() || "Not Scheduled",
          notes: form.notes.trim() || undefined,
        });

        if (!res.success) {
          setErrors({ general: res.error || "Failed to update lead." });
          setIsSubmitting(false);
          return;
        }

        onSuccess(`Lead "${leadToEdit.id}" updated successfully.`);
        onClose();
      } else {
        const res = addLead({
          studentName: form.studentName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          course: form.course,
          source: form.source,
          campaignId: form.campaignId || undefined,
          campaignName: form.campaignName.trim() || undefined,
          stage: form.stage,
          counselor: form.counselor,
          nextFollowUp: form.nextFollowUp.trim() || "Tomorrow, 10:00 AM",
          notes: form.notes.trim() || undefined,
        });

        if (!res.success) {
          setErrors({ general: res.error || "Failed to add lead." });
          setIsSubmitting(false);
          return;
        }

        onSuccess(`New student lead "${form.studentName}" registered successfully.`);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-xl rounded-lg bg-white shadow-xl border border-border-subtle my-8 text-text-primary">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-text-primary">
              {isEditing ? `Edit Lead (${leadToEdit?.id})` : "Add New Student Lead"}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {isEditing
                ? "Update candidate information, course interest, and counseling stage."
                : "Enter prospect contact details and marketing source attribution."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {errors.general && (
            <div className="p-3 rounded-md bg-status-error-light border border-status-error-border text-status-error text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Row 1: Student Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Student Full Name <span className="text-status-error">*</span>
              </label>
              <Input
                value={form.studentName}
                onChange={(e) =>
                  setForm({ ...form, studentName: e.target.value })
                }
                placeholder="e.g. Anjali Menon"
                error={Boolean(errors.studentName)}
              />
              {errors.studentName && (
                <p className="text-[11px] text-status-error">{errors.studentName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Phone Number <span className="text-status-error">*</span>
              </label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +91 98451 23456"
                error={Boolean(errors.phone)}
              />
              {errors.phone && (
                <p className="text-[11px] text-status-error">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Email Address
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. anjali@example.com"
                error={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="text-[11px] text-status-error">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Course Interested In <span className="text-status-error">*</span>
              </label>
              <Select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                error={Boolean(errors.course)}
              >
                {COURSE_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              {errors.course && (
                <p className="text-[11px] text-status-error">{errors.course}</p>
              )}
            </div>
          </div>

          {/* Row 3: Lead Source & Campaign */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Lead Source <span className="text-status-error">*</span>
              </label>
              <Select
                value={form.source}
                onChange={(e) => {
                  const newSource = e.target.value;
                  const matchingCamp = campaigns.find(
                    (c) =>
                      (c.id === form.campaignId || c.name === form.campaignName) &&
                      c.sourceName.toLowerCase() === newSource.toLowerCase()
                  );
                  setForm({
                    ...form,
                    source: newSource,
                    campaignId: matchingCamp ? matchingCamp.id : undefined,
                    campaignName: matchingCamp ? matchingCamp.name : "",
                  });
                  setUseCustomCampaign(false);
                }}
                error={Boolean(errors.source)}
              >
                {availableSources.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} {!s.isActive ? "(Inactive)" : ""}
                  </option>
                ))}
              </Select>
              {errors.source && (
                <p className="text-[11px] text-status-error">{errors.source}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Campaign / Referral Tag
              </label>
              {campaignsForSource.length > 0 && !useCustomCampaign ? (
                <div className="space-y-1">
                  <Select
                    value={form.campaignId || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__custom__") {
                        setUseCustomCampaign(true);
                        setForm({ ...form, campaignId: undefined });
                      } else if (!val) {
                        setForm({ ...form, campaignId: undefined, campaignName: "" });
                      } else {
                        const found = campaignsForSource.find((c) => c.id === val);
                        setForm({
                          ...form,
                          campaignId: val,
                          campaignName: found ? found.name : "",
                        });
                      }
                    }}
                  >
                    <option value="">(None / Direct Inquiry)</option>
                    {campaignsForSource.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.status})
                      </option>
                    ))}
                    <option value="__custom__">+ Enter custom campaign tag...</option>
                  </Select>
                </div>
              ) : (
                <div className="space-y-1">
                  <Input
                    value={form.campaignName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        campaignName: e.target.value,
                        campaignId: undefined,
                      })
                    }
                    placeholder="e.g. Justdial_Direct or IG_Ad_CPC"
                  />
                  {campaignsForSource.length > 0 && useCustomCampaign && (
                    <button
                      type="button"
                      onClick={() => setUseCustomCampaign(false)}
                      className="text-[11px] text-primary hover:underline"
                    >
                      ← Select from managed campaigns
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Pipeline Stage & Assigned Counselor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Pipeline Stage <span className="text-status-error">*</span>
              </label>
              <Select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                error={Boolean(errors.stage)}
              >
                {PIPELINE_STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </Select>
              {errors.stage && (
                <p className="text-[11px] text-status-error">{errors.stage}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Assigned Counsellor <span className="text-status-error">*</span>
              </label>
              <Select
                value={form.counselor}
                onChange={(e) =>
                  setForm({ ...form, counselor: e.target.value })
                }
                error={Boolean(errors.counselor)}
              >
                {COUNSELOR_OPTIONS.map((cns) => (
                  <option key={cns} value={cns}>
                    {cns}
                  </option>
                ))}
              </Select>
              {errors.counselor && (
                <p className="text-[11px] text-status-error">{errors.counselor}</p>
              )}
            </div>
          </div>

          {/* Row 5: Next Follow-up */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Next Follow-up Schedule
            </label>
            <Input
              value={form.nextFollowUp}
              onChange={(e) =>
                setForm({ ...form, nextFollowUp: e.target.value })
              }
              placeholder="e.g. Tomorrow, 11:30 AM or Oct 18, 2:00 PM"
            />
          </div>

          {/* Row 6: Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Counsellor Notes / Academic Background
            </label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Enter qualifications (e.g. B.Sc Nursing, B.Pharm), preferred timings, or discount discussion notes..."
              rows={3}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="bg-primary hover:bg-primary-hover text-white"
            >
              {isEditing ? "Save Changes" : "Save Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
