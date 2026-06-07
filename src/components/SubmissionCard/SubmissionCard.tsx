import type { FormSubmission } from '../../types/form';
import './SubmissionCard.css';

type SubmissionCardProps = {
  submission: FormSubmission;
  isHighlighted?: boolean;
};

const sourceLabels = {
  uncontrolled: 'Uncontrolled Form',
  'hook-form': 'React Hook Form',
} as const;

export function SubmissionCard({
  submission,
  isHighlighted = false,
}: SubmissionCardProps) {
  const { data, source, submittedAt } = submission;

  return (
    <article
      className={isHighlighted ? 'submission-card--highlighted' : undefined}
    >
      <h3>{sourceLabels[source]}</h3>
      <p>Submitted: {new Date(submittedAt).toLocaleString()}</p>
      <dl>
        <div>
          <dt>Name</dt>
          <dd>{data.name}</dd>
        </div>
        <div>
          <dt>Age</dt>
          <dd>{Number.isNaN(data.age) ? '—' : data.age}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{data.email || '—'}</dd>
        </div>
        <div>
          <dt>Gender</dt>
          <dd>{data.gender || '—'}</dd>
        </div>
        <div>
          <dt>Terms accepted</dt>
          <dd>{data.acceptTerms ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>Country</dt>
          <dd>{data.country || '—'}</dd>
        </div>
        <div>
          <dt>Image</dt>
          <dd>
            <img src={data.imageBase64} alt={`${data.name} upload`} width={120} />
          </dd>
        </div>
      </dl>
    </article>
  );
}
