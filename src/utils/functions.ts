export function actualDate() {
  const data = new Date()
  // const dia = String(data.getDate()).padStart(2, '0')
  // const mes = String(data.getMonth()+1).padStart(2, '0')
  // const ano = String(data.getFullYear())
  // const dataAtual = dia +'/'+ mes +'/'+ ano
 
 const dataAtual = new Intl.DateTimeFormat('pt-BR').format(data);
  return dataAtual
}