import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import Select from '../../src/components/ui/Select';
import Slider from '../../src/components/ui/Slider';
import Badge from '../../src/components/ui/Badge';

describe('Button', () => {
  it('renders children and calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects the disabled prop', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('defaults to type="button" so it does not submit forms unexpectedly', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>content</Card>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});

describe('Select', () => {
  it('renders options and reflects the selected value', () => {
    render(
      <Select
        label="Flat type"
        value="4 ROOM"
        onChange={() => {}}
        options={[
          { value: '3 ROOM', label: '3 ROOM' },
          { value: '4 ROOM', label: '4 ROOM' },
        ]}
      />
    );
    expect(screen.getByLabelText('Flat type')).toHaveValue('4 ROOM');
  });

  it('calls onChange with the new value', async () => {
    const onChange = vi.fn();
    render(
      <Select
        label="Flat type"
        value="3 ROOM"
        onChange={onChange}
        options={[
          { value: '3 ROOM', label: '3 ROOM' },
          { value: '4 ROOM', label: '4 ROOM' },
        ]}
      />
    );
    await userEvent.selectOptions(screen.getByLabelText('Flat type'), '4 ROOM');
    expect(onChange).toHaveBeenCalled();
  });
});

describe('Slider', () => {
  it('renders with the given value and label', () => {
    render(<Slider label="Income" value={5000} min={0} max={20000} onChange={() => {}} />);
    expect(screen.getByLabelText('Income')).toHaveValue('5000');
  });

  it('calls onChange when moved', () => {
    const onChange = vi.fn();
    render(<Slider label="Income" value={5000} min={0} max={20000} onChange={onChange} />);
    const slider = screen.getByLabelText('Income');
    fireEvent.change(slider, { target: { value: '6000' } });
    expect(onChange).toHaveBeenCalled();
  });
});

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge tone="success">Affordable</Badge>);
    expect(screen.getByText('Affordable')).toBeInTheDocument();
  });
});
