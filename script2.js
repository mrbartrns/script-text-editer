import exportFromJSON from 'export-from-json'
 
const data = [{ foo: 'foo'}, { bar: 'bar' }]
const fileName = 'download'
const exportType = 'csv'
 
exportFromJSON({ data, fileName, exportType })