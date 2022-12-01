import React, {Fragment} from 'react';
import { Backdrop, Button, CircularProgress, Divider, Grid } from '@mui/material';

import Customization from './Customization';
import Dependencies from './Dependencies';
import { useApiLoaded, useVersionsLoaded } from '../store/AppReducer';
import { Overlay } from '../data/Overlay';
import { useCanDownload, useOverlay } from '../store/OverlayReducer';
import { isNil, pickBy } from 'lodash';

import * as FileSaver from 'file-saver';

import * as queryString from 'query-string';
import { useDefaultValues } from '../store/OptionReducer';
export const downloadAsZip = (fileName: string, data: any) => {
    // const blob = new Blob([data], { type: 'text/zip;charset=utf-8' });
    FileSaver.saveAs(data, `${fileName}.tar.gz`);
};

export default function Initializr() {

    const apiLoaded = useApiLoaded();
    const versionsLoaded = useVersionsLoaded();
    const canDownload = useCanDownload();
    const overlay = useOverlay();
    const defaults = useDefaultValues();
    const download = async (overlay: Overlay) => {
        const used = pickBy(overlay, (value: any) => value !== "" && !isNil(value));
        const string = queryString.stringify(used, { arrayFormat: "comma" });
        const response = await fetch(`?${string}`);
        if (response.ok) {
            const file = await response.blob();
            downloadAsZip(overlay.name ? overlay.name : defaults.name || 'cas', file);
        }
    };

    return (
        <Fragment>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={false}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{
                    padding: "2rem",
                }}
            >
                {apiLoaded && versionsLoaded ? (
                    <>
                        <Grid item xs={6} style={{ padding: "1rem" }}>
                            <Customization />
                            <Divider style={{ margin: "1rem 0rem" }} />
                            <div style={{ display: "flex" }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    onClick={() => download(overlay)}
                                    disabled={!canDownload}
                                >
                                    Download
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={6} style={{ padding: "1rem" }}>
                            <Dependencies />
                        </Grid>
                    </>
                ) : (
                    <Grid
                        item
                        xs={12}
                        style={{
                            padding: "1rem",
                            justifyContent: "center",
                            display: "flex",
                        }}
                        zeroMinWidth
                    >
                        <CircularProgress />
                    </Grid>
                )}
            </Grid>
        </Fragment>
    );
}
