import { useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/features/projects/api';
import type { ProjectDto } from '@/types';
import { useSnackbar } from 'notistack';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly project?: ProjectDto | null;
}

const initial = {
  name: '', description: '', projectCode: '', clientName: '', clientEmail: '', clientPhone: '',
  siteAddress: '', city: '', state: '', postalCode: '', country: '', budget: 0, currency: 'LKR',
  notes: '',
};

const projectValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Project name must be at least 2 characters.')
    .required('Project name is required.'),
  projectCode: Yup.string()
    .required('Project code is required.'),
  clientName: Yup.string()
    .required('Client name is required.'),
  siteAddress: Yup.string()
    .required('Site address is required.'),
  budget: Yup.number()
    .typeError('Budget must be a number.')
    .moreThan(0, 'Budget must be greater than 0.')
    .required('Project budget is required.'),
  clientEmail: Yup.string()
    .email('Please enter a valid email address.')
    .optional(),
});

export default function ProjectFormDialog({ open, onClose, project }: Props) {
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!project;

  const initialValues = useMemo(() => {
    if (project) {
      return {
        name: project.name,
        description: project.description ?? '',
        projectCode: project.projectCode,
        clientName: project.clientName,
        clientEmail: project.clientEmail ?? '',
        clientPhone: project.clientPhone ?? '',
        siteAddress: project.siteAddress,
        city: project.city ?? '',
        state: project.state ?? '',
        postalCode: project.postalCode ?? '',
        country: project.country ?? '',
        budget: project.budget,
        currency: project.currency,
        notes: project.notes ?? '',
      };
    }
    return initial;
  }, [project]);

  const handleClose = () => {
    formik.resetForm({ values: initial });
    onClose();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: projectValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        if (isEdit) {
          await updateProject({ id: project!.id, data: { ...values, budget: Number(values.budget) } }).unwrap();
          enqueueSnackbar('Project updated successfully', { variant: 'success' });
        } else {
          await createProject({ ...values, budget: Number(values.budget) }).unwrap();
          enqueueSnackbar('Project created successfully', { variant: 'success' });
        }
        handleClose();
      } catch (err: unknown) {
        const apiErr = err as { data?: { message?: string; errors?: Record<string, string[]> } };
        if (apiErr?.data?.errors) {
          const sErrors: Record<string, string> = {};
          Object.entries(apiErr.data.errors).forEach(([k, msgs]) => {
            sErrors[k.charAt(0).toLowerCase() + k.slice(1)] = msgs.join(', ');
          });
          setErrors(sErrors);
        }
        enqueueSnackbar(apiErr?.data?.message || 'Failed to save project', { variant: 'error' });
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Project Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              id="projectCode"
              name="projectCode"
              label="Project Code"
              value={formik.values.projectCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isEdit}
              error={formik.touched.projectCode && Boolean(formik.errors.projectCode)}
              helperText={formik.touched.projectCode && formik.errors.projectCode}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="clientName"
              name="clientName"
              label="Client Name"
              value={formik.values.clientName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.clientName && Boolean(formik.errors.clientName)}
              helperText={formik.touched.clientName && formik.errors.clientName}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="clientEmail"
              name="clientEmail"
              label="Client Email"
              value={formik.values.clientEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              error={formik.touched.clientEmail && Boolean(formik.errors.clientEmail)}
              helperText={formik.touched.clientEmail && formik.errors.clientEmail}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="clientPhone"
              name="clientPhone"
              label="Client Phone"
              value={formik.values.clientPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="siteAddress"
              name="siteAddress"
              label="Site Address"
              value={formik.values.siteAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.siteAddress && Boolean(formik.errors.siteAddress)}
              helperText={formik.touched.siteAddress && formik.errors.siteAddress}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth id="city" name="city" label="City" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth id="state" name="state" label="State" value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth id="postalCode" name="postalCode" label="Postal Code" value={formik.values.postalCode} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth id="country" name="country" label="Country" value={formik.values.country} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="budget"
              name="budget"
              label="Budget"
              value={formik.values.budget}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              error={formik.touched.budget && Boolean(formik.errors.budget)}
              helperText={formik.touched.budget && formik.errors.budget}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select id="currency" name="currency" label="Currency" value={formik.values.currency} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              {['USD', 'EUR', 'GBP', 'LKR', 'AUD', 'CAD'].map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth id="notes" name="notes" label="Notes" value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur} multiline rows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={() => formik.handleSubmit()} disabled={creating || updating || formik.isSubmitting}>
          {(() => {
            if (creating || updating || formik.isSubmitting) return 'Saving...';
            return isEdit ? 'Update' : 'Create';
          })()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
