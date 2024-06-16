import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import useApi from "@hooks/useApi";
import { downloadBlob } from "@services/Utils";
import "./personalCsvImport.scss";
import { toast } from "react-toastify";
import Dialog from "@components/dialogs/dialog/Dialog";
import CsvErrorReport from "@components/csv/CsvErrorReport/CsvErrorReport";
import FileSelector from "@components/formControls/FileSelector/FileSelector";

type PersonalCSVImportProps = {
    onImportSuccess: Function
}

const PersonalCSVImport = ({onImportSuccess}: PersonalCSVImportProps) => {

    const {t} = useTranslation();
    const {personalApi} = useApi();

    const [file, setFile] = useState(undefined);
    const [isIntegre, setIsIntegre] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [reportPopupOpen, setReportPopupOpen] = useState(false);
    const [importErrors, setImportErrors] = useState<any>({});
    const onFileChange = (e: any) => {
        setFile(e.target.files[0]);
        setIsIntegre(false);
    }

    const onDownloadModelClick = () => {
        personalApi.getCSVModel().then(res => {
            downloadBlob(new Blob([res.data]), 'model_personnel.csv');
        })
    }

    const onCheckIntegrityClick = async () => {
        if(file) {
            setProcessing(true);
            try {
                const formData = new FormData();
                formData.append('file', file)
                const errors = (await personalApi.checkCSVIntegrity(formData)).data;

                setImportErrors(errors);

                const errorsCount = errors.missing_fields ? errors.missing_fields.length : 0 + errors.extra_fields ? errors.extra_fields.length : 0 + errors.input ? errors.input.length : 0
                if(!Object.keys(errors).length) {
                    setIsIntegre(true);
                    toast(t('csv.validData'), {type: 'success'})
                    return;
                } else {
                    const content = (
                        <div>
                            {errorsCount} erreur{errorsCount > 1 ? 's' : ''} dans le fichier
                            <br/>
                            <a onClick={() => setReportPopupOpen(true)} style={{fontWeight: 'bold', color: 'red', cursor: 'pointer', textDecoration: 'underline'}} className="danger">{t('csv.checkReport')}</a>
                        </div>
                    )
    
                    toast(content, {type: 'error'})
                }
                    
            } catch (e) {
                toast(t(e.response.data), {type: 'error'});
            } finally {
                setProcessing(false);
            }

            
        }
        
    }

    const onImport = () => {
        if(file) {
            const formData = new FormData();
            formData.append('file', file);
            personalApi.importCSV(formData).then(() => {
                onImportSuccess();
            });
        }
        
    }

    return (
        <div className="csv-import">
            {/* <p>Vous pouvez télécharger le modèle de données ici</p>   */}
            <div className="body-header">
                <h5>{t('csv.formatTitle')}</h5>
                <a className="terciary" onClick={onDownloadModelClick}>{t('csv.getmodel')}</a>
            </div>
            <ul>
                <li><b>- Email:</b> <span>l'adresse email de l'utilisateur</span></li>
                <li><b>- Prénom:</b> <span>le prénom de l'utilisateur</span></li>
                <li><b>- Nom:</b> <span>le nom de famille de l'utilisateur</span></li>
                <li><b>- Compte:</b> <span>1 pour créer un compte, ou 0 ou vide pour créer un profil sans compte</span></li>
            </ul> 
            <br/>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <FileSelector accept=".csv" onChange={onFileChange} label="Parcourir" />
                {file && <button style={{alignSelf: 'flex-end'}} className={isIntegre ? "success" : ""} disabled={processing} onClick={() => isIntegre ? onImport() : onCheckIntegrityClick()}>{isIntegre ? t('csv.import') : t("csv.checkIntegrity")}</button>}
            </div>
            <Dialog isModal={true} isOpen={reportPopupOpen} setIsOpen={setReportPopupOpen} title={t('csv.errors.reportTitle')}>
                <CsvErrorReport errors={importErrors} />
            </Dialog>
        </div>
    )
}

export default PersonalCSVImport;