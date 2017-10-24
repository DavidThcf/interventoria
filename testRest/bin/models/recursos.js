/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recursos', {
    keym: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_recurso: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    keym_car: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'caracteristicas',
        key: 'keym'
      }
    },
    id_usuario_car: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_caracteristica: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nombre_recurso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'recursos'
  });
};
