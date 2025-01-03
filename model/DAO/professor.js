/***************************************************************************************
* Objetivo: criar a integração com o banco de dados MySQL para fazer o CRUD
*           de professores
* Data: 03/09/2024
* Autor: Gabriela Fernandes
* Versão: 1.0
***************************************************************************************/

// import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client')

// instanciando o objeto prisma com as caracteristicas do prisma client
const prisma = new PrismaClient()

// post: inserir prof
const insertProfessor = async(dadosProf) => {
    try {
        let sql
    
        sql = `insert into tbl_professor (nome, email, senha, icone_id, status)values(
                '${dadosProf.nome}',
                '${dadosProf.email}',
                md5('${dadosProf.senha}'),
                '${dadosProf.icone_id}',
               true
            )`

        // executa o sciptSQL no DB (devemos usar o comando execute e não o query)
        // o comando execute deve ser utilizado para INSERT, UPDATE, DELETE
        let result = await prisma.$executeRawUnsafe(sql)
    
        // validação para verificar se o insert funcionou no DB
        if(result){
            return true
        } else {
            return false
        }
        
    } catch (error) {
        console.log(error);
        return false
    }
}

// put: atualizar um prof existente filtrando pelo ID
const updateProfessor = async(dadosProf, id) => {
    try {
        let sql 

        sql = `update tbl_professor set 
                                            nome = "${dadosProf.nome}",
                                            email = "${dadosProf.email}",
                                            icone_id = "${dadosProf.icone_id}"
                                            where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        // validação para verificar se o insert funcionou no DB
        if(result){
            return true
        } else {
            return false
        }
    
    } catch (error) {
        console.log(error);
        
        return false
    }
}

// get: atualizar icone do professor
const updateIcone = async(idIcone, id) => {
    try {
        let sql = `call updateIconeProf(${id}, ${idIcone})`

        // executa o scriptSQL no BD e recebe o retorno dos dados na variável
        let rsProf = await prisma.$executeRawUnsafe(sql)
        
        return rsProf

    } catch (error) {
        return false
    }
}

// delete/put: método put apenas trocando o status, para "esconder" um prof filtrando pelo ID
const updateDeleteProfessor = async(id) => {
    try {
        let sql = `update tbl_professor set status = false where id = ${id}`

        // executa o scriptSQL no BD e recebe o retorno dos dados na variável
        let rsProf = await prisma.$executeRawUnsafe(sql)
        
        return rsProf

    } catch (error) {
        return false
    }
}

// put: método put apenas trocando o status, para aparecer um prof antes escondido
const updateRecoverProfessor = async(id) => {
    try {
        let sql = `update tbl_professor set status = true where id = ${id}`

        // executa o scriptSQL no BD e recebe o retorno dos dados na variável
        let rsProf = await prisma.$executeRawUnsafe(sql)
        
        return rsProf

    } catch (error) {
        return false
    }
}

const selectDisciplinasByProfId = async(id) => {
    try {
        let sql = `select td.nome from tbl_disciplina as td
                        inner join tbl_prof_disciplinas as tpd on td.id=tpd.disciplina_id
                        where tpd.professor_id = ${id}`

        // executa o scriptSQL no BD e recebe o retorno dos dados na variável
        let rsDiscProf = await prisma.$queryRawUnsafe(sql)
        return rsDiscProf
    } catch (error) {
        return false
    }

}

// get: listar todos os profs
const selectAllProfessores = async () => {
    try {
        let sql = `select tp.id, tp.nome, tp.email, td.nome from tbl_professor as tp
                    inner join tbl_prof_disciplinas on tbl_prof_disciplinas.professor_id=tp.id
                    inner join tbl_disciplina as td on tbl_prof_disciplinas.disciplina_id=td.id
                    order by tp.id desc`
    
        // $queryrawUnsafe(‘encaminha apenas a variavel’)
        // $queryRaw(‘codigo digitado aqui’)
    
        // executa o scriptSQL no BD e recebe o retorno dos dados na variável rsAdmin
        let rsProf = await prisma.$queryRawUnsafe(sql)
        return rsProf
        
    } catch (error) {
        console.log(error)
        return false
    }
}

// get: buscar o prof existente filtrando pelo ID
const selectByIdProfessor = async (id) => {

    try {

        // realiza a busca do prof pelo id
        let sql = `select id, nome, email, senha from tbl_professor where id=${id} and status=true`

        // executa no DBA o script SQL
        let rsProf = await prisma.$queryRawUnsafe(sql)
        return rsProf

    } catch (error) {
        return false
    }
}

// get: buscar o prof existente filtrando pelo nome
const selectByNome = async (nome) => {
    
    try {
        let sql = `select id, nome, email, senha, status from tbl_professor where nome like '%${nome}%' and status=true`
    
        // executa o scriptSQL no BD e recebe o retorno dos dados na variável rsAdmin
        let rsProf = await prisma.$queryRawUnsafe(sql)

        return rsProf
        
    } catch (error) {
        return false
    }
}

// get: pegar o ultimo id
const selectLastId = async () => {
    try {

        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_professor limit 1' 

        let rsProf = await prisma.$queryRawUnsafe(sql)

        return rsProf

    } catch (error) {
        return false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    }
}

const updateProfSenha = async (dadosProf, idProf) => {

    try {
        let sql = `update tbl_professor set senha = md5('${dadosProf.senha}') where id = ${idProf}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

const selectValidacaoProf = async (emailProf, senhaProf) => {

    try {
        let sql = `select nome, email from tbl_professor where email = '${emailProf}' and senha = md5('${senhaProf}')`
        let rsProf = await prisma.$queryRawUnsafe(sql)
        return rsProf        
    } catch (error) {
        return false
    }

}

//#region prof-disc
const selectProfByDisciplina = async(disciplina) => {
    try {
        id = disciplina

        let sql = `select tp.id, tp.nome, tp.email from tbl_professor as tp
                    inner join tbl_prof_disciplinas on tbl_prof_disciplinas.professor_id=tp.id
                    inner join tbl_disciplina on tbl_prof_disciplinas.disciplina_id=tbl_disciplina.id
                    where tbl_disciplina.id=${id}`

        // executa o scriptSQL no BD e recebe o retorno dos dados na variável
        let rsDiscProf = await prisma.$queryRawUnsafe(sql)
        return rsDiscProf
    } catch (error) {
        return false
    }
}

const selectDisciplina = async(disciplina) => {
    try {
        id = disciplina

        let sql = `select id, nome as disciplinas
                    from tbl_disciplina where id=${id}`

        // executa o scriptSQL no BD e recebe o retorno dos dados na variável
        let rsDiscProf = await prisma.$queryRawUnsafe(sql)
        return rsDiscProf
    } catch (error) {
        return false
    }
}

const insertProfDisciplina = async (idDisc, idProf) => {
    try {
        let sql
    
        sql = `insert into tbl_prof_disciplinas(disciplina_id, professor_id)values(
            ${idDisc},
            ${idProf}
            )`
            
        // executa o sciptSQL no DB (devemos usar o comando execute e não o query)
        // o comando execute deve ser utilizado para INSERT, UPDATE, DELETE
        let result = await prisma.$executeRawUnsafe(sql)
    
        // validação para verificar se o insert funcionou no DB
        if(result){
            return true
        } else {
            return false
        }
        
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports={
    insertProfessor,
    updateProfessor,
    updateIcone,
    updateDeleteProfessor,
    updateRecoverProfessor,
    selectAllProfessores,
    selectByIdProfessor,
    selectByNome,
    selectLastId,
    updateProfSenha,
    selectValidacaoProf,
    selectDisciplinasByProfId,
    selectDisciplina,
    selectProfByDisciplina,
    insertProfDisciplina
}