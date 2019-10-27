'use strict'

module.exports = {
	components: {
		logger: {
			module: '../components/log/Logger',
			targets: {
				default: {
					module: './target/ConsoleTarget',
					levels: '*'
				}
			}
		},
		i18n: {
			module: '../components/i18n/Translation',
		}
	},
	validators: {
		'required': '../validators/RequiredValidator',
		'number': '../validators/NumberValidator',
		'integer': '../validators/IntegerValidator',
		'string': '../validators/StringValidator',
		'in': '../validators/InValidator',
		'uuid': '../validators/UUIDValidator',
		'mobile': '../validators/MobileValidator',
		'email': '../validators/EmailValidator',
		'version': '../validators/VersionValidator',
		'exist': '../validators/ExistValidator',
		'array': '../validators/ArrayValidator',
		'custom': '../validators/CustomValidator',
		'url': '../validators/UrlValidator'
	}
}