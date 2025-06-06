import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoGerenteEmpresaFarmacêutica from "../../contextos/contexto-gerente_empresa_farmaceutica";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarInteressesGerenteEmpresaFarmacêutica } from "../../serviços/serviços-gerente_empresa_farmaceutica";
import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex }
    from "../../utilitários/estilos";

    export default function AdministrarInteresses() {

        const referênciaToast = useRef(null);
        const { usuárioLogado } = useContext(ContextoUsuário);
        const { interesseConsultado, setInteresseConsultado, setPatenteSelecionada }
        = useContext(ContextoGerenteEmpresaFarmacêutica);
        const [listaInteresses, setListaInteresses] = useState([]);
        const navegar = useNavigate();
        const opçõesCategoria = [{ label: "Produto", value: "Produto" },
            { label: "Processo", value: "Processo" },
            { label: "Formulação", value: "Formulação" },
            { label: "Combinação", value: "Combinação" },
            { label: "Biotecnologia", value: "Biotecnologia" }];
        
        function retornarPáginaInicial() { navegar("/pagina-inicial"); };
    
        function adicionarInteresse() {
            setInteresseConsultado(null);
            setPatenteSelecionada(null);
            navegar("../cadastrar-interesse");
        };
    
        function ConsultarTemplate(interesse) {
            function consultar() {
                setInteresseConsultado(interesse);
                setPatenteSelecionada(null);
                navegar("../cadastrar-interesse");
        };
        return (
            <Button icon="pi pi-search"
            className={estilizarBotãoTabela(usuárioLogado.cor_tema,
                interesseConsultado?.id === interesse.id)}
            tooltip="Consultar interesse" tooltipOptions={{ position: 'top' }} onClick={consultar}/>
            );
        };
        
        function DropdownÁreaTemplate(opções) {
            function alterarFiltroDropdown(event) {
                return opções.filterCallback(event.value, opções.index);
        };
        return <Dropdown value={opções.value} options={opçõesCategoria} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
        };

        useEffect(() => {
            let desmontado = false;
            async function buscarInteressesGerenteEmpresaFarmacêutica() {
                try {
                    const response = await serviçoBuscarInteressesGerenteEmpresaFarmacêutica(usuárioLogado.cpf);
                    if (!desmontado && response.data) setListaInteresses(response.data);
                } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
            };
            buscarInteressesGerenteEmpresaFarmacêutica();
            return () => desmontado = true;
        }, [usuárioLogado.cpf]);

        return (
            <div className={estilizarFlex()}>
                <Toast ref={referênciaToast} position="bottom-center"/>
                <Card title="Administrar Interesses" className={estilizarCard(usuárioLogado.cor_tema)}>
                    <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                        emptyMessage="Nenhum interesse encontrado." value={listaInteresses}
                        responsiveLayout="scroll" breakpoint="490px" removableSort
                        className={estilizarDataTable()}
                        paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
                        <Column field="patente.numero" header="Patente" filter showFilterOperator={false}
        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                        <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>
                        <Column field="patente.pesquisador.usuário.nome" header="Pesquisador" filter
                            showFilterOperator={false}
                            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                        <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                            field="patente.categoria" header="Categoria" filter filterMatchMode="equals"
                            filterElement={DropdownÁreaTemplate} showClearButton={false}
                            showFilterOperator={false} showFilterMatchModes={false}
                            filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable/>                        
                        <Column field="patente.paises_abrangidos" header="Paises Abrangidos" filter showFilterOperator={false}
                            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    </DataTable>
                    <Divider className={estilizarDivider()}/>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarPáginaInicial}/>
                    <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarInteresse}/>
                </Card>
            </div>
        );
    }