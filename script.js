
document.addEventListener('DOMContentLoaded', function() {
    // Define a data de início (20 de novembro de 2024, 06:30:00)
    // Atenção: O JavaScript usa o formato YYYY-MM-DDTHH:mm:ss para criar datas
    // e os meses são baseados em 0 (janeiro é 0, novembro é 10).
    const dataInicio = new Date('2024-11-20T06:30:00');
    const elementoTempoDecorrido = document.getElementById('tempoDecorrido');

    function atualizarContagem() {
        const agora = new Date();
        const diferencaMilissegundos = agora - dataInicio; // Diferença em milissegundos

        // Garante que a diferença não é negativa (se a data de início fosse no futuro)
        if (diferencaMilissegundos < 0) {
            elementoTempoDecorrido.textContent = "Ainda não chegamos à data!";
            return;
        }

        // Cálculos para anos, meses, dias, horas, minutos e segundos
        let segundos = Math.floor(diferencaMilissegundos / 1000);
        let minutos = Math.floor(segundos / 60);
        let horas = Math.floor(minutos / 60);
        let dias = Math.floor(horas / 24);

        // Para meses e anos, o cálculo é mais complexo devido aos dias variáveis nos meses e anos bissextos.
        // A abordagem abaixo é uma aproximação que funciona bem para a maioria dos casos.
        // Uma abordagem mais precisa envolveria iteração ou bibliotecas de data.

        let anos = 0;
        let meses = 0;

        // Calcula anos e meses de forma mais precisa, removendo-os da data de início
        let dataAtualTemp = new Date(dataInicio.getTime()); // Cria uma cópia da data de início
        while (dataAtualTemp < agora) {
            let proximoAno = new Date(dataAtualTemp.getFullYear() + 1, dataAtualTemp.getMonth(), dataAtualTemp.getDate(), dataAtualTemp.getHours(), dataAtualTemp.getMinutes(), dataAtualTemp.getSeconds());
            if (proximoAno <= agora) {
                anos++;
                dataAtualTemp = proximoAno;
            } else {
                break;
            }
        }

        // Após calcular os anos, calculamos os meses restantes
        while (dataAtualTemp < agora) {
            // Tenta adicionar um mês
            let proximoMes = new Date(dataAtualTemp.getFullYear(), dataAtualTemp.getMonth() + 1, dataAtualTemp.getDate(), dataAtualTemp.getHours(), dataAtualTemp.getMinutes(), dataAtualTemp.getSeconds());
            
            // Se o próximo mês for maior que a data atual, mas estamos no último dia do mês e o próximo mês não existe nesse dia
            // (ex: 31 de janeiro + 1 mês = 3 de março, mas deveria ser 28 de fevereiro)
            // Ajustamos para o último dia do próximo mês.
            if (proximoMes.getDate() !== dataAtualTemp.getDate() && proximoMes.getMonth() !== ((dataAtualTemp.getMonth() + 1) % 12)) {
                 proximoMes = new Date(dataAtualTemp.getFullYear(), dataAtualTemp.getMonth() + 2, 0, dataAtualTemp.getHours(), dataAtualTemp.getMinutes(), dataAtualTemp.getSeconds()); // Último dia do próximo mês
            }

            if (proximoMes <= agora) {
                meses++;
                dataAtualTemp = proximoMes;
            } else {
                break;
            }
        }
        
        // Recalcula a diferença para pegar os dias, horas, minutos e segundos exatos após subtrair anos e meses completos
        const diferencaFinalMilissegundos = agora - dataAtualTemp;

        segundos = Math.floor(diferencaFinalMilissegundos / 1000);
        minutos = Math.floor(segundos / 60);
        horas = Math.floor(minutos / 60);
        dias = Math.floor(horas / 24);

        // Ajusta para mostrar o resto dos segundos, minutos, horas, dias
        segundos %= 60;
        minutos %= 60;
        horas %= 24;


        elementoTempoDecorrido.textContent =
            `${anos} anos, ${meses} meses, ${dias} dias, ` +
            `${String(horas).padStart(2, '0')}h ${String(minutos).padStart(2, '0')}m ${String(segundos).padStart(2, '0')}s`;
    }

    // Atualiza a contagem a cada segundo
    setInterval(atualizarContagem, 1000);

    // Chama a função uma vez imediatamente para evitar o "Calculando..." inicial
    atualizarContagem();
});