/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('configuracion_inicial', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    configuracion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    val_configuracion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'configuracion_inicial'
  });
};
