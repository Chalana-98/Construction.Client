import { useState, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem,
} from '@mui/material';
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
  siteAddress: '', city: '', state: '', postalCode: '', country: '', budget: 0, currency: 'USD',
  notes: '',
};

export default function ProjectFormDialog({ open, onClose, project }: Props) {
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!project;

  const derivedForm = useMemo(() => {
    if (project) {
      return {
        name: project.name, description: project.description ?? '', projectCode: project.projectCode,
        clientName: project.clientName, clientEmail: project.clientEmail ?? '',
        clientPhone: project.clientPhone ?? '', siteAddress: project.siteAddress,
        city: project.city ?? '', state: project.state ?? '', postalCode: project.postalCode ?? '',
        country: project.country ?? '', budget: project.budget, currency: project.currency,
        notes: project.notes ?? '',
      };
    }
    return initial;
  }, [project]);

  const [overrides, setOverrides] = useState<Partial<typeof initial>>({});
  const form = { ...derivedForm, ...overrides };
  const setForm = (updater: typeof initial | ((prev: typeof initial) => typeof initial)) => {
    const next = typeof updater === 'function' ? updater(form) : updater;
    setOverrides(next);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateProject({ id: project!.id, data: form }).unwrap();
        enqueueSnackbar('Project updated', { variant: 'success' });
      } else {
        await createProject(form).unwrap();
        enqueueSnackbar('Project created', { variant: 'success' });
      }
      onClose();
    } catch {
      enqueueSnackbar('Failed to save project', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField fullWidth label="Project Name" value={form.name} onChange={update('name')} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="Project Code" value={form.projectCode} onChange={update('projectCode')} required disabled={isEdit} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Description" value={form.description} onChange={update('description')} multiline rows={2} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Client Name" value={form.clientName} onChange={update('clientName')} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Client Email" value={form.clientEmail} onChange={update('clientEmail')} type="email" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Client Phone" value={form.clientPhone} onChange={update('clientPhone')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Site Address" value={form.siteAddress} onChange={update('siteAddress')} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="City" value={form.city} onChange={update('city')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="State" value={form.state} onChange={update('state')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Postal Code" value={form.postalCode} onChange={update('postalCode')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Country" value={form.country} onChange={update('country')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Budget" value={form.budget} onChange={update('budget')} type="number" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select label="Currency" value={form.currency} onChange={update('currency')}>
              {['USD', 'EUR', 'GBP', 'LKR', 'AUD', 'CAD'].map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Notes" value={form.notes} onChange={update('notes')} multiline rows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={creating || updating}>
          {(() => {
            if (creating || updating) return 'Saving...';
            return isEdit ? 'Update' : 'Create';
          })()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
