/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('repositorios_usuarios', {
    id_usuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    ruta_repositorio: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'repositorios_usuarios'
  });
};
