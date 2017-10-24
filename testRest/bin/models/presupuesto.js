/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presupuesto', {
    keym: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_presupuesto: {
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
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valor: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'presupuesto'
  });
};
