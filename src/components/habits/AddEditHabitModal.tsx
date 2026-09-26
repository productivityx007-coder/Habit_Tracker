import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { Habit, HabitCategory, HabitFrequency, HabitPriority } from '../../types/habit';
import { getTodayString } from '../../utils/dateUtils';

interface AddEditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  initialHabit?: Habit | null;
}

const EMOJI_OPTIONS = ['⏰', '💧', '🏋️‍♂️', '🧘', '🌽', '🎓', '📵', '💵', '🏃', '📚', '🥑', '💻', '🌿', '💊', '✍️', '🎯', '🍎', '🚴'];
const COLOR_OPTIONS = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#ef4444', '#14b8a6'];
const CATEGORY_OPTIONS: { id: HabitCategory; label: string }[] = [
  { id: 'productivity', label: 'Productivity' },
  { id: 'health', label: 'Health' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'study', label: 'Study' },
  { id: 'mindfulness', label: 'Mindfulness' },
  { id: 'finance', label: 'Finance' },
  { id: 'personal', label: 'Personal' },
];

export const AddEditHabitModal: React.FC<AddEditHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHabit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⏰');
  const [color, setColor] = useState('#3b82f6');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [goal, setGoal] = useState<number>(30);
  const [targetType, setTargetType] = useState<'boolean' | 'numeric'>('boolean');
  const [targetCount, setTargetCount] = useState<number>(1);
  const [unit, setUnit] = useState<string>('');
  const [category, setCategory] = useState<HabitCategory>('productivity');
  const [priority, setPriority] = useState<HabitPriority>('medium');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [startDate, setStartDate] = useState(getTodayString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description || '');
      setIcon(initialHabit.icon);
      setColor(initialHabit.color);
      setFrequency(initialHabit.frequency);
      setGoal(initialHabit.goal);
      setTargetType(initialHabit.targetType);
      setTargetCount(initialHabit.targetCount || 1);
      setUnit(initialHabit.unit || '');
      setCategory(initialHabit.category);
      setPriority(initialHabit.priority);
      setReminderEnabled(Boolean(initialHabit.reminderEnabled));
      setReminderTime(initialHabit.reminderTime || '08:00');
      setStartDate(initialHabit.startDate || getTodayString());
    } else {
      setName('');
      setDescription('');
      setIcon('⏰');
      setColor('#3b82f6');
      setFrequency('daily');
      setGoal(30);
      setTargetType('boolean');
      setTargetCount(1);
      setUnit('');
      setCategory('productivity');
      setPriority('medium');
      setReminderEnabled(false);
      setReminderTime('08:00');
      setStartDate(getTodayString());
    }
    setErrorMsg('');
  }, [initialHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a habit name');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onSave({
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
        frequency,
        goal: Number(goal) || 30,
        targetType,
        targetCount: targetType === 'numeric' ? Number(targetCount) || 1 : undefined,
        unit: targetType === 'numeric' ? unit : undefined,
        category,
        priority,
        reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime : undefined,
        startDate,
        archived: false,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {initialHabit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}

            {/* Habit Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="habit-name">Habit Name *</label>
              <input
                id="habit-name"
                type="text"
                className="form-input"
                placeholder="e.g. Wake up at 6AM, Drink 3L Water"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="habit-desc">Description (Optional)</label>
              <input
                id="habit-desc"
                type="text"
                className="form-input"
                placeholder="Why is this habit meaningful to you?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Icon & Color Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Icon / Emoji</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '110px', overflowY: 'auto', padding: '6px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      style={{
                        fontSize: '1.25rem',
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: icon === e ? 'var(--primary-light)' : 'transparent',
                        border: icon === e ? '1.5px solid var(--primary)' : '1px solid transparent',
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Theme Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '12px 6px' }}>
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: color === c ? '2.5px solid var(--text-primary)' : 'none',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      {color === c && <Check size={14} color="#fff" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category & Frequency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HabitCategory)}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Frequency</label>
                <select 
                  className="form-input"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                >
                  <option value="daily">Every Day</option>
                  <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                  <option value="weekends">Weekends Only (Sat-Sun)</option>
                </select>
              </div>
            </div>

            {/* Monthly Target Days Goal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Monthly Goal Target (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="form-input"
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tracking Type</label>
                <select
                  className="form-input"
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as 'boolean' | 'numeric')}
                >
                  <option value="boolean">Simple Checkbox (Done/Not Done)</option>
                  <option value="numeric">Counter / Quantity (e.g. 3 Liters)</option>
                </select>
              </div>
            </div>

            {/* Counter details if numeric */}
            {targetType === 'numeric' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="form-group">
                  <label className="form-label">Daily Target Amount</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={targetCount}
                    onChange={(e) => setTargetCount(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit of Measure</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="liters, pages, mins"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Reminder Setting */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }} htmlFor="reminder-toggle">
                  Enable Daily Reminder
                </label>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Get scheduled prompts to keep your streak alive</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="reminder-toggle"
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                {reminderEnabled && (
                  <input
                    type="time"
                    className="form-input"
                    style={{ padding: '4px 8px' }}
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Saving...' : initialHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
