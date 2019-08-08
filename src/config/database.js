module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  port: '5433', // Se for padrão ñ precisa usar esta propriedade.
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
