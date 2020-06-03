import { createConnection, Connection, DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { logger } from './logger';

const createDatabaseConnection = (): Promise<Connection> => {
  try {
    return createConnection({
      type: 'postgres',
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      synchronize: true,
      logging: false,
      entities: ['src/entity/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      namingStrategy: new SnakeNamingStrategy()
    }).then((connection) => {
      logger.info('📚 Connected to database!');
      return connection;
    });
  } catch (error) {
    throw Error(`Connection Error: ${error.stack}`);
  }
};

class SnakeNamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName (className: string, customName: string): string {
    return customName || snakeCase(`${className}s`);
  }

  columnName (
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[]
  ): string {
    return (
      snakeCase(embeddedPrefixes.join('_')) +
      (customName || snakeCase(propertyName))
    );
  }

  relationName (propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName (relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName (
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string
  ): string {
    return snakeCase(
      `${firstTableName}_${firstPropertyName.replace(
        /\./gi,
        '_'
      )}_${secondTableName}`
    );
  }

  joinTableColumnName (
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return snakeCase(`${tableName}_${columnName || propertyName}`);
  }

  classTableInheritanceParentColumnName (
    parentTableName: string,
    parentTableIdPropertyName: string
  ): string {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }

  eagerJoinRelationAlias (alias: string, propertyPath: string): string {
    return `${alias}__${propertyPath.replace('.', '_')}`;
  }
}

export { createDatabaseConnection };
