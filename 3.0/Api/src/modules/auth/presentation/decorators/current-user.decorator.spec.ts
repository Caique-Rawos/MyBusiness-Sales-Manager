import 'reflect-metadata';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';

function getParamDecoratorFactory(decorator: Function) {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public test(@(decorator() as any) _value: unknown) {}
  }
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('CurrentUser decorator', () => {
  it('should extract request.user from the execution context', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const user = { sub: 1, tenantId: 10 };
    const ctx: any = { switchToHttp: () => ({ getRequest: () => ({ user }) }) };

    expect(factory(null, ctx)).toBe(user);
  });
});
