export interface Variable {
    name: string;
    line: string;
    attributeType: string;
    dataType: string;
}

export default function getShaderVariables(...shaders: string[]) {
    const variables: Variable[] = [];
    shaders.forEach((shader) => {
      const groups = shader
        .match(/\n\s*(in|attribute|uniform) ([\w]+) ([\w]+)(\[.+\])?;/g)
        ?.map((line) => line.match(/\n\s*((in|attribute|uniform) ([\w]+) ([\w]+)(\[.+\])?;)/));
      variables.push(
        ...(groups ?? [])
        .filter((a): a is RegExpMatchArray  => !!a)
        .map(([,line, attributeType, dataType, name]) => {
          return { line, attributeType, dataType, name };
        }),
      );
    });
    return variables;
}
