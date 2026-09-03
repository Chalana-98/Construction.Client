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

/**
 * Colour is mapped per enum, not by raw ordinal.
 *
 * A single shared map keyed on the numeric value collided across enums whose ordinals mean
 * different things — ProjectStatus.OnHold (3) and EquipmentStatus.OutOfService (3) both
 * rendered green, so a stalled project and broken plant read as healthy.
 */
const projectStatusColors: Record<ProjectStatus, ChipProps['color']> = {
  [ProjectStatus.Planning]: 'default',
  [ProjectStatus.Approved]: 'info',
  [ProjectStatus.InProgress]: 'primary',
  [ProjectStatus.OnHold]: 'warning',
  [ProjectStatus.Completed]: 'success',
  [ProjectStatus.Cancelled]: 'error',
};

const taskStatusColors: Record<TaskStatus, ChipProps['color']> = {
  [TaskStatus.NotStarted]: 'default',
  [TaskStatus.InProgress]: 'primary',
  [TaskStatus.OnHold]: 'warning',
  [TaskStatus.Completed]: 'success',
  [TaskStatus.Cancelled]: 'default',
  [TaskStatus.Blocked]: 'error',
};

const issueStatusColors: Record<IssueStatus, ChipProps['color']> = {
  [IssueStatus.Open]: 'error',
  [IssueStatus.UnderReview]: 'warning',
  [IssueStatus.InProgress]: 'primary',
  [IssueStatus.Resolved]: 'success',
  [IssueStatus.Closed]: 'default',
  [IssueStatus.Rejected]: 'default',
};

const equipmentStatusColors: Record<EquipmentStatus, ChipProps['color']> = {
  [EquipmentStatus.Available]: 'success',
  [EquipmentStatus.InUse]: 'primary',
  [EquipmentStatus.UnderMaintenance]: 'warning',
  [EquipmentStatus.OutOfService]: 'error',
  [EquipmentStatus.Retired]: 'default',
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

  const colorMap: Record<StatusChipProps['type'], Record<number, ChipProps['color']>> = {
    projectStatus: projectStatusColors,
    taskStatus: taskStatusColors,
    issueStatus: issueStatusColors,
    equipmentStatus: equipmentStatusColors,
  };

  const label = labelMap[type][value as keyof (typeof labelMap)[typeof type]] ?? 'Unknown';

  return (
    <Chip
      label={label}
      color={colorMap[type][value] ?? 'default'}
      size={size}
      variant="outlined"
      // Status is also conveyed by the label text, so the meaning does not depend on colour
      // alone for colour-blind users.
      aria-label={`Status: ${label}`}
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
