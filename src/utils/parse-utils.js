import JsonRefs from 'json-refs';
import converter from 'swagger2openapi';

export default async function ProcessSpec(specUrl) {
  let jsonParsedSpec, convertedSpec, resolvedRefSpec;
  let convertOptions = { patch:true, warnOnly:true };
  let resolveOptions = { resolveCirculars: false }
  let refParserOptions = {
    resolve: {
      http: { 
        withCredentials: false 
      } 
    }
  };
  try {
    convertedSpec = await converter.convertUrl(specUrl, convertOptions);
    resolvedRefSpec = await JsonRefs.resolveRefs(convertedSpec.openapi, resolveOptions);
    jsonParsedSpec = resolvedRefSpec.resolved;
  }
  catch(err){
    console.info("%c There was an issue while parsing the spec %o ", "color:orangered", err);
  }

  console.info("%c Spec Conversion - Success !!! ","color:cornflowerblue");
  let openApiSpec = jsonParsedSpec;
  let methods=['get','put','post','delete','patch','options','head'];
  let tags=[];
  let totalPathCount=0;
  // For each path find the tag and push it into the corrosponding tag
  for (let path in openApiSpec.paths) {
    let commonParams = openApiSpec.paths[path].parameters;
    let commonPathProp = {
      "summary"    : openApiSpec.paths[path].summary,
      "description": openApiSpec.paths[path].description,
      "servers"    : openApiSpec.paths[path].servers ? openApiSpec.paths[path].servers : [],
      "parameters" : openApiSpec.paths[path].parameters ? openApiSpec.paths[path].parameters : []
    };

    methods.forEach(function(methodName){
      let tagObj;
      let tagText;
      let tagDescr;
        
      if (openApiSpec.paths[path][methodName]){
        let fullPath = openApiSpec.paths[path][methodName];
        // If path.methods are tagged, else generate it from path 
        if(fullPath.tags){
          tagText = fullPath.tags[0];
          if (openApiSpec.tags){
            tagDescr = openApiSpec.tags.find(function(v){
              return (v.name === tagText)
            });
          }
        }
        else {
          let firstWordEndIndex = path.indexOf("/",1);
          if (firstWordEndIndex === -1){
            firstWordEndIndex = (path.length-1);
          }
          else{
            firstWordEndIndex=firstWordEndIndex-1;
          }
          tagText = path.substr(1,firstWordEndIndex);
        }
        tagObj = tags.find(v => v.name == tagText);

        if (!tagObj){
          tagObj = { 
            "name"  : tagText,
            "description" : tagDescr?tagDescr.description:"",
            "paths" : []
          }
          tags.push(tagObj);
        }
        //Generate Path summary and Description if it is missing for a method
        let summary = fullPath.summary?fullPath.summary:"";
        let description = fullPath.description?fullPath.description:"";
        if (!summary && description){
          if (description.length > 100){
            let charIndex = -1;
            charIndex = description.indexOf("\n");
            if (charIndex === -1 || charIndex > 100){
              charIndex = description.indexOf(". ");
            }
            if (charIndex === -1 || charIndex > 100){
              charIndex = description.indexOf(".");
            }
            if (charIndex === -1 || charIndex > 100){
              summary = description;
            }
            else {
              summary = description.substr(0, charIndex);
            }
          }
          else{
            summary = description;
          }
        }

        // Merge Common Parameters with This methods parameters
        let finalParameters =[];
        if (commonParams){
          if (fullPath.parameters){
            finalParameters = commonParams.filter(commonParam => {
              if (! fullPath.parameters.some(  param => (commonParam.name===param.name && commonParam.in===param.in)  )) {
                return commonParam;
              }
            }).concat(fullPath.parameters)
          }
          else{
            finalParameters =  commonParams.slice(0);
          }
        }
        else{
          finalParameters = fullPath.parameters? fullPath.parameters.slice(0):[];
        }

        //Update Responses
        tagObj.paths.push({
          "summary"     : summary,
          "method"      : methodName,
          "description" : fullPath.description,
          "path"        : path,
          "operationId" : fullPath.operationId,
          "requestBody" : fullPath.requestBody,
          "parameters"  : finalParameters,
          "servers"     : fullPath.servers ? commonPathProp.servers.concat(fullPath.servers):commonPathProp.servers,
          "responses"   : fullPath.responses,
          "deprecated"  : fullPath.deprecated,
          "security"    : fullPath.security,
          "commonSummary"     : commonPathProp.summary,
          "commonDescription" : commonPathProp.description,
        });
        totalPathCount++;
      }
    }); // End of Methods

  }

  let securitySchemes={};
  let servers=[];

  securitySchemes = (openApiSpec.components? openApiSpec.components.securitySchemes:{});
  if (openApiSpec.servers){
    openApiSpec.servers.map(function(v){
      if (v.url && v.url.substr(0,1) === "/"){
        let paths = specUrl.split("/");
        v.url = paths[0]+"//"+paths[2]+v.url;
      }
    })
  }
  servers = openApiSpec.servers;
  tags.sort((a, b) =>  (a.name < b.name ? -1 : (a.name > b.name ? 1: 0)) );
  let parsedSpec = {
    "info"    : openApiSpec.info,
    "tags"    : tags,
    "externalDocs": openApiSpec.externalDocs,
    "securitySchemes": securitySchemes, 
    "servers" : servers, // In swagger 2, its generated from schemes, host and basePath properties
    "basePath": openApiSpec.basePath, // Only available in swagger V2 
    "totalPathCount" : totalPathCount,
  }
  return parsedSpec;
}