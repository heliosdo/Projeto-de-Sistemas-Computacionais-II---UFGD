import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoGerenteEmpresaFarmacêutica from "../../contextos/contexto-gerente_empresa_farmaceutica";
import { serviçoBuscarPatentes } from "../../serviços/serviços-gerente_empresa_farmaceutica";
import mostrarToast from "../../utilitários/mostrar-toast";

import { TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
    from "../../utilitários/estilos";
    
export default function PesquisarPatentes() {
    
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { patenteConsultada, setPatenteConsultada, setPatenteSelecionada }
        = useContext(ContextoGerenteEmpresaFarmacêutica);
    const [listaPatentes, setListaPatentes] = useState([]);
    const navegar = useNavigate();
    const opçõesCategoria = [{ label: "Produto", value: "Produto" },
        { label: "Processo", value: "Processo" },
        { label: "Formulação", value: "Formulação" },
        { label: "Combinação", value: "Combinação" },
        { label: "Biotecnologia", value: "Biotecnologia" }];

    const opçõesPaisesAbrangidos = [
        { label: "África", value: "África" },
        { label: "América do Norte", value: "América do Norte" },
        { label: "América do Sul", value: "América do Sul" },
        { label: "Antártida", value: "Antártida" },
        { label: "Ásia", value: "Ásia" },
        { label: "Europa", value: "Europa" },
        { label: "Oceania", value: "Oceania" },
        { label: "Vários países", value: "Vários países" }
        ];
    
    function retornarCadastrarInteresse() {
        setPatenteSelecionada(patenteConsultada);
        setPatenteConsultada(null);
        navegar("../cadastrar-interesse");
    };

    function ConsultarTemplate(patente) {
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema,
                    patenteConsultada?.id === patente.id)}
                tooltip="Consultar Patente" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    setPatenteConsultada(patente);
                    navegar("../consultar-patente");
                }}/>
        );
    };

    function DropdownCategoriaTemplate(opções) {
        function alterarFiltroDropdown(event) {
            return opções.filterCallback(event.value, opções.index);
        };
        return <Dropdown value={opções.value} options={opçõesCategoria} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    };

    function DropdownPaisesTemplate(opções) {
        function alterarFiltroDropdown(event) {
            return opções.filterCallback(event.value, opções.index);
        };
        return <Dropdown value={opções.value} options={opçõesPaisesAbrangidos} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    };

    function BooleanBodyTemplate(patente) {
    if (patente.exclusividade_mercado) return "Sim";
        else return "Não";
    };
    
    function BooleanFilterTemplate(opções) {
    
       function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
        return (
        <div>
            <label>Exclusividade no Mercado:</label>
            <TriStateCheckbox
            className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
            onChange={alterarFiltroTriState}/>
        </div>
    );
};

    useEffect(() => {
        let desmontado = false;
        async function buscarPatentes() {
            try {
                const response = await serviçoBuscarPatentes();
                if (!desmontado && response.data) setListaPatentes(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        };
        buscarPatentes();
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center"/>
            <Card title="Pesquisar Patentes" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma patente encontrada." value={listaPatentes}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}><Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>
                    <Column field="pesquisador.usuário.nome" header="Nome do Pesquisador" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    <Column field="numero" header="Número" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="categoria" header="Categoria" filter filterMatchMode="equals"
                        filterElement={DropdownCategoriaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="ano_concessao" header="Ano de Concessão" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="paises_abrangidos" header="Países Abrangidos" filter filterMatchMode="equals"
                        filterElement={DropdownPaisesTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="exclusividade_mercado" header="Exclusividade Mercado" dataType="boolean" filter
                        showFilterOperator={false}
                        body={BooleanBodyTemplate} filterElement={BooleanFilterTemplate}
                        filterMatchMode="equals" showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                </DataTable>
                <Divider className={estilizarDivider()}/>
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarCadastrarInteresse}/>
            </Card>
        </div>
    );
}