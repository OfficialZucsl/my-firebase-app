import LoanHistory from './loan-history';
import LoanSummaryCard from './loan-summary-card';
import PersonalizedTipsForm from './personalized-tips-form';
import RepaymentChart from './repayment-chart';

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
      <div className="lg:col-span-1 xl:col-span-1 space-y-4 md:space-y-8">
        <LoanSummaryCard />
        <RepaymentChart />
      </div>
      <div className="lg:col-span-2 xl:col-span-3 space-y-4 md:space-y-8">
        <PersonalizedTipsForm />
        <div className="lg:col-span-2 xl:col-span-3">
          <LoanHistory />
        </div>
      </div>
    </div>
  );
}
