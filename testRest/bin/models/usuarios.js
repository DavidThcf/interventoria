/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
    id_usuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false
    },
    administrador: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    e_mail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true
    },
    genero: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'usuarios'
  });
};
