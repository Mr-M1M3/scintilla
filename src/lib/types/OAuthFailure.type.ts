import type OAuthPayload from './OAuthPayload.type';
import type PBFailure from './PBFailure.type';

export type OAuthFailure = PBFailure<Omit<OAuthPayload<never>, 'createData'>>;
