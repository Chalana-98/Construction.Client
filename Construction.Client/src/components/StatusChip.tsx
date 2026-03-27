import { Chip, type ChipProps } from '@mui/material';
import {
  ProjectStatus,
  ProjectStatusLabels,
  TaskStatus,
  TaskStatusLabels,
  TaskPriority,
  TaskPriorityLabels,
  IssueStatus,
  IssueStatusLabels,
  IssuePriority,
  IssuePriorityLabels,
  EquipmentStatus,
  EquipmentStatusLabels,
} from '@/types';

type StatusValue = ProjectStatus | TaskStatus | IssueStatus | EquipmentStatus;
type PriorityValue = TaskPriority | IssuePriority;

const statusColorMap: Record<number, ChipProps['color']> = {
  // Planning / NotStarted / Open / Available
  0: 'default',
  // Approved / InProgress / UnderReview / InUse
  1: 'info',
  // InProgress / OnHold / InProgress / UnderMaintenance
  2: 'primary',
  // OnHold / Completed / Resolved / OutOfService
  3: 'success',
  // Completed / Cancelled / Closed / Retired
  4: 'success',
  // Cancelled / Blocked / Rejected
  5: 'error',
};

const priorityColorMap: Record<number, ChipProps['color']> = {
  0: 'default', // Low
  1: 'info', // Medium
  2: 'warning', // High
  3: 'error', // Critical
};

interface StatusChipProps {
  readonly type: 'projectStatus' | 'taskStatus' | 'issueStatus' | 'equipmentStatus';
  readonly value: StatusValue;
  readonly size?: ChipProps['size'];
}

export function StatusChip({ type, value, size = 'small' }: StatusChipProps) {
  const labelMap = {
    projectStatus: ProjectStatusLabels,
    taskStatus: TaskStatusLabels,
    issueStatus: IssueStatusLabels,
    equipmentStatus: EquipmentStatusLabels,
  };

  return (
    <Chip
      label={labelMap[type][value as keyof (typeof labelMap)[typeof type]] ?? 'Unknown'}
      color={statusColorMap[value] ?? 'default'}
      size={size}
      variant="outlined"
    />
  );
}

interface PriorityChipProps {
  readonly value: PriorityValue;
  readonly size?: ChipProps['size'];
}

export function PriorityChip({ value, size = 'small' }: PriorityChipProps) {
  const labels = { ...TaskPriorityLabels, ...IssuePriorityLabels };
  return (
    <Chip
      label={labels[value as keyof typeof labels] ?? 'Unknown'}
      color={priorityColorMap[value] ?? 'default'}
      size={size}
    />
  );
}
