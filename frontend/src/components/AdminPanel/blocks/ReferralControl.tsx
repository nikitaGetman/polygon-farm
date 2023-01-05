import { useReferralManagerSubscriptions } from '@/hooks/useReferralManager';
import { bigNumberToString } from '@/utils/number';

import { AdminSection } from '../common/AdminSection';
import { ControlField } from '../common/ControlField';

export const ReferralControl = () => {
  const {
    levelSubscriptionCost,
    fullSubscriptionCost,
    updateLevelSubscription,
    updateFullSubscription,
  } = useReferralManagerSubscriptions();

  return (
    <AdminSection
      title="Referral Manager"
      isLoading={levelSubscriptionCost.isLoading || fullSubscriptionCost.isLoading}
    >
      <ControlField
        label="1 Level Subscription cost"
        value={levelSubscriptionCost.data ? bigNumberToString(levelSubscriptionCost.data) : null}
        onSubmit={updateLevelSubscription.mutateAsync}
      />
      <ControlField
        label="Full Subscription cost"
        value={fullSubscriptionCost.data ? bigNumberToString(fullSubscriptionCost.data) : null}
        onSubmit={updateFullSubscription.mutateAsync}
      />
    </AdminSection>
  );
};
