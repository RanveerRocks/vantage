export type DegreeId =
  | 'cs-it'
  | 'engineering'
  | 'business-finance'
  | 'economics'
  | 'data-science'
  | 'health-life-sciences'
  | 'design-media'
  | 'humanities-social'

export interface Degree {
  id: DegreeId
  name: string
}

export const DEGREES: Degree[] = [
  { id: 'cs-it', name: 'Computer Science & IT' },
  { id: 'engineering', name: 'Engineering (non-CS)' },
  { id: 'business-finance', name: 'Business & Finance' },
  { id: 'economics', name: 'Economics' },
  { id: 'data-science', name: 'Data Science & Analytics' },
  { id: 'health-life-sciences', name: 'Health & Life Sciences' },
  { id: 'design-media', name: 'Design & Media' },
  { id: 'humanities-social', name: 'Humanities & Social Sciences' },
]

export function findDegree(id: string | undefined): Degree | undefined {
  return DEGREES.find((degree) => degree.id === id)
}
