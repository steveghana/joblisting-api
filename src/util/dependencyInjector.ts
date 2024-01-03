import db from '../Config/index';
import emailUtil from './email';
import config from '../Config/config';
// let ws: SocketGateway;

export type Dependencies = Partial<{
  db: typeof db;
  email: typeof emailUtil;
  config: Partial<typeof config>;
}>;

const globalDefaultDependencies: Dependencies = {
  db: db,
  email: emailUtil,
  config,
};

export function injectDependencies(
  dependencies: Dependencies,
  requestedDependencies: Array<keyof Dependencies>,
  defaultDependencies = globalDefaultDependencies,
): Dependencies {
  if (!dependencies) {
    dependencies = {};
  }

  requestedDependencies.forEach((requestedDependency) => {
    if (!dependencies[requestedDependency]) {
      (dependencies[requestedDependency] as any) =
        defaultDependencies[requestedDependency];
    }
  });

  return dependencies;
}

export default {
  injectDependencies,
};
