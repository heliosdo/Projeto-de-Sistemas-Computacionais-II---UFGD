import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import ContextoPesquisador from "../../contextos/contexto-pesquisador";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoBuscarPatentesPesquisador } from "../../serviços/serviços-pesquisador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
    estilizarColunaConsultar, estilizarColumnHeader, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex } from "../../utilitários/estilos";

    const OPÇÕES_PAISES_ABRANGIDOS = [
        { label: "África", value: "África" },
        { label: "América do Norte", value: "América do Norte" },
        { label: "América do Sul", value: "América do Sul" },
        { label: "Antártida", value: "Antártida" },
        { label: "Ásia", value: "Ásia" },
        { label: "Europa", value: "Europa" },
        { label: "Oceania", value: "Oceania" },
        { label: "Vários países", value: "Vários países" }
    ];

    export default function AdministrarPatentes() {
        const referênciaToast = useRef(null);
        const { usuárioLogado } = useContext(ContextoUsuário);
        const { patenteConsultada, setPatenteConsultada } = useContext(ContextoPesquisador);
        const [listaPatentes, setListaPatentes] = useState([]);
        const navegar = useNavigate();
        
        const opçõesCategoria = [
            { label: "Produto", value: "Produto" },
            { label: "Processo", value: "Processo" },
            { label: "Formulação", value: "Formulação" },
            { label: "Combinação", value: "Combinação" },
            { label: "Biotecnologia", value: "Biotecnologia" }
        ];

    function retornarPáginaInicial() { navegar("/pagina-inicial"); };

    function adicionarPatente() {
        setPatenteConsultada(null);
        navegar("../cadastrar-patente");
    };

    function ConsultarTemplate(patente) {
        return (
            <Button icon="pi pi-search"
                className={estilizarBotãoTabela(usuárioLogado.cor_tema, patenteConsultada?.id === patente.id)}
                tooltip="Consultar Patente" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    setPatenteConsultada(patente);
                    navegar("../cadastrar-patente");
                }}/>
        );
    };

    function DropdownCategoriaTemplate(opções) {
        return (
            <Dropdown 
                value={opções.value} 
                options={opçõesCategoria} 
                placeholder="Selecione"
                onChange={(e) => opções.filterCallback(e.value, opções.index)} 
                showClear 
            />
        );
    };

    function DropdownPaísesTemplate(opções) {
        return (
            <Dropdown 
                value={opções.value} 
                options={OPÇÕES_PAISES_ABRANGIDOS} 
                placeholder="Selecione"
                onChange={(e) => opções.filterCallback(e.value, opções.index)} 
                showClear 
            />
        );
    };

    useEffect(() => {
        let desmontado = false;
        
        async function buscarPatentesPesquisador() {
            try {
                const response = await serviçoBuscarPatentesPesquisador(usuárioLogado.cpf);
                if (!desmontado && response.data) { 
                    setListaPatentes(response.data); 
                }
            } catch (error) {
                mostrarToast(referênciaToast, error.response?.data?.erro || "Erro ao buscar patentes", "error");
            }
        };
        buscarPatentesPesquisador();
        return () => { desmontado = true; };
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center"/>
            <Card title="Administrar Patentes" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable 
                    dataKey="id" 
                    size="small" 
                    paginator 
                    rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma patente encontrada." 
                    value={listaPatentes}
                    responsiveLayout="scroll" 
                    breakpoint="490px" 
                    removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}
                >
                    <Column 
                        bodyClassName={estilizarColunaConsultar()} 
                        body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                    />
                    <Column 
                        field="numero" 
                        header="Número" 
                        filter 
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} 
                        sortable
                    />
                    <Column 
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="categoria" 
                        header="Categoria" 
                        filter 
                        filterMatchMode="equals"
                        filterElement={DropdownCategoriaTemplate} 
                        showClearButton={false}
                        showFilterOperator={false} 
                        showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} 
                        showFilterMenuOptions={false} 
                        sortable 
                    />
                    <Column 
                        field="ano_concessao" 
                        header="Ano de Concessão" 
                        filter 
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} 
                        sortable
                    />
                    <Column 
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="paises_abrangidos" 
                        header="Países Abrangidos" 
                        filter 
                        filterMatchMode="equals"
                        filterElement={DropdownPaísesTemplate} 
                        showClearButton={false}
                        showFilterOperator={false} 
                        showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} 
                        showFilterMenuOptions={false} 
                        sortable 
                    />
                </DataTable>
                
                <Divider className={estilizarDivider()}/>
                
                <div className={estilizarFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarPáginaInicial}/>
                    <Button className={estilizarBotão()} label="Adicionar" 
                        onClick={adicionarPatente}/>
                </div>
            </Card>
        </div>
    );
}