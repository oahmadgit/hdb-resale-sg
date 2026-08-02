import Badge from '../ui/Badge';

const VERDICT_CONFIG = {
  affordable: { tone: 'success', label: 'Affordable' },
  borderline: { tone: 'warning', label: 'Borderline' },
  unaffordable: { tone: 'danger', label: 'Unaffordable' },
};

function VerdictBadge({ verdict }) {
  const config = VERDICT_CONFIG[verdict] ?? { tone: 'neutral', label: verdict };
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export default VerdictBadge;
