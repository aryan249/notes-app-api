describe('config', () => {
  it('should export config with expected shape', () => {
    const { config } = require('./index');

    expect(config).toHaveProperty('port');
    expect(config).toHaveProperty('databaseUrl');
    expect(config).toHaveProperty('jwtSecret');
    expect(config).toHaveProperty('jwtExpiresIn');
    expect(config).toHaveProperty('nodeEnv');
    expect(config).toHaveProperty('bcryptRounds');
    expect(typeof config.port).toBe('number');
    expect(typeof config.bcryptRounds).toBe('number');
  });

  it('should parse port as a number', () => {
    const { config } = require('./index');
    expect(Number.isInteger(config.port)).toBe(true);
    expect(config.port).toBeGreaterThan(0);
  });

  it('should parse bcryptRounds as a number', () => {
    const { config } = require('./index');
    expect(Number.isInteger(config.bcryptRounds)).toBe(true);
    expect(config.bcryptRounds).toBeGreaterThanOrEqual(1);
  });
});
