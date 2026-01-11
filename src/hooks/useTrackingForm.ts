/**
 * useTrackingForm Hook - Track detailed form field changes
 * Delegates to useTracking for actual tracking
 */

'use client';

import { useCallback } from 'react';
import { useTracking } from './useTracking';

/**
 * Hook for tracking form field changes in detail
 */
export function useTrackingForm(formName: string) {
  const { track } = useTracking();

  const trackFieldChange = useCallback(
    (fieldName: string, value: any, fieldType: string = 'text') => {
      track(`${formName}_field_changed`, {
        field: fieldName,
        type: fieldType,
        hasValue: !!value,
        valueLength: typeof value === 'string' ? value.length : 0,
      });
    },
    [formName, track]
  );

  const trackFieldFocus = useCallback(
    (fieldName: string) => {
      track(`${formName}_field_focused`, {
        field: fieldName,
      });
    },
    [formName, track]
  );

  const trackFieldBlur = useCallback(
    (fieldName: string, finalValue: any) => {
      track(`${formName}_field_blurred`, {
        field: fieldName,
        hadValue: !!finalValue,
      });
    },
    [formName, track]
  );

  return { trackFieldChange, trackFieldFocus, trackFieldBlur };
}

