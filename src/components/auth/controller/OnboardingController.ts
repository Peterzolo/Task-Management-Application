import { Request, Response } from 'express';
import { ONBOARDING_SERVICE } from '../services';
import inversifyContainer from '../../../ioc/inversify.config';
import { SuccessResponse } from '../../../library/helpers';
import { IOnboardingService } from '../../../types/auth/IAuthService';

const container = inversifyContainer();
const onboardingService = container.get<IOnboardingService>(ONBOARDING_SERVICE);

class OnboardingController {
  public async postCompleteSignup(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await onboardingService.signUp(req.body);

    return new SuccessResponse('Sign up successful', outcome).send(res);
  }
}

export default new OnboardingController();
