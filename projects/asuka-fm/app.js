/**
 * Asuka-FM Interactive Presentation Logic.
 * Manages training pipeline stages, split-screen curtain comparisons,
 * virtual camera carousel flights, and VAE rollout bottleneck metrics.
 */

document.addEventListener("DOMContentLoaded", () => {
    initShowcaseSwitcher();
    initPipelineStageHandlers();
    initViewportSimulation();
    initShiftCropVisualizer();
    initSprintFrontier();
    initRopeInspector();
    initCurtainSlider();
    initCameraCarousel();
    initDisentangleTabs();
    initPixelAdaptInspector();
    initAmortizationExplorer();
    initBenchmarkTabs();
    initBibtexCopy();
});

// 0. Interactive Showcase Switcher (Anime vs. Open-Domain Real World)
function initShowcaseSwitcher() {
    const btnAnime = document.getElementById("btnShowcaseAnime");
    const btnReal = document.getElementById("btnShowcaseReal");
    const showcaseImg = document.getElementById("showcaseImg");
    const showcaseCaption = document.getElementById("showcaseCaption");

    if (!btnAnime || !btnReal || !showcaseImg || !showcaseCaption) return;

    const showcaseData = {
        anime: {
            src: "images/anime_showcase_grid.png",
            caption: "<strong>Anime Domain:</strong> Zero-shot synthesis from our 206M dual-stream backbone pretrained on 337K Danbooru illustrations. Demonstrates sharp linework, anatomical consistency, and multi-concept binding without human aesthetic post-filtering."
        },
        real: {
            src: "images/showcase.png",
            caption: "<strong>Open-Domain General Corpus:</strong> High-fidelity zero-shot visual synthesis across diverse open-domain subjects (landscapes, animals, cinematic text scenes) trained from scratch on 625K balanced multi-source samples in 161.2 hours ($53.20)."
        }
    };

    function setDomain(domainKey, activeBtn, inactiveBtn) {
        activeBtn.classList.add("active-preset");
        inactiveBtn.classList.remove("active-preset");

        showcaseImg.style.opacity = "0.3";
        setTimeout(() => {
            showcaseImg.src = showcaseData[domainKey].src;
            showcaseCaption.innerHTML = showcaseData[domainKey].caption;
            showcaseImg.style.opacity = "1.0";
        }, 150);
    }

    btnAnime.onclick = () => setDomain("anime", btnAnime, btnReal);
    btnReal.onclick = () => setDomain("real", btnReal, btnAnime);
}
// 1. Pipeline Flowchart Stage Telemetry
function initPipelineStageHandlers() {
    const btn256 = document.getElementById("btnSub256");
    const btn512 = document.getElementById("btnSub512");
    const btn1MP = document.getElementById("btnSub1MP");
    const btnPixel = document.getElementById("btnSubPixel");

    const bannerTitle = document.getElementById("bannerTitle");
    const bannerHighlight = document.getElementById("bannerHighlight");
    const bannerGrid = document.getElementById("bannerGrid");
    const bannerSummary = document.getElementById("bannerSummary");

    if (!btn256 || !btn512 || !btn1MP || !bannerTitle || !bannerGrid) return;

    const stageData = {
        "256": {
            title: "Stage 1: 256px Base Semantic Pretraining (625K Open Corpus)",
            highlight: "68.0h DiT ($22.44) + 3.8h Offline VAE ($1.27)",
            stats: [
                {
                    label: "Phase 1A: SPRINT Sparse",
                    val: "75 Ep · 47.0h ($15.51)",
                    desc: "r = 0.75 (64 active tok), 282.6 img/s, 86.8% MFU_act, 23.74 EFLOPs"
                },
                {
                    label: "Phase 1B/1C: Dense Refine + WSD",
                    val: "20 Ep · 21.0h ($6.93)",
                    desc: "r = 0.00 (256 tok), 172.5 img/s, 73.4% MFU_act, WSD → 1e-5"
                },
                {
                    label: "Memory & Benchmarks (256²)",
                    val: "GenEval 0.588 / DPG 78.96",
                    desc: "52 GB latents cached in RAM (0% VAE wall); Danbooru 337K: 58.0h ($19.14)"
                }
            ],
            summary: "In-RAM latent caching eliminates disk I/O and VAE overhead at 256²; " +
                     "SPRINT 75% dropping + continuous aspect RoPE anchor global layout at 86.8% physical MFU_act."
        },
        "512": {
            title: "Stage 2: 512px High-Res Adaptation (625K Open Corpus)",
            highlight: "81.0h DiT ($26.73) + 8.4h VAE ($2.78) | Total: 161.2h ($53.20)",
            stats: [
                {
                    label: "Phase 2A: High-Res SPRINT",
                    val: "25 Ep · 40.0h ($13.20)",
                    desc: "r = 0.75 (256 active tok), 108.5 img/s, 68.3% MFU_act, temp GenEval 0.480"
                },
                {
                    label: "Phase 2B/2C: Dense Refine + WSD",
                    val: "15 Ep · 41.0h ($13.53)",
                    desc: "r = 0.00 (1,024 tok), 64.8 img/s, 71.2% MFU_act, restores color attribution"
                },
                {
                    label: "Streaming & Final Benchmarks",
                    val: "GenEval 0.609 / DPG 78.51",
                    desc: "203 GB latents streamed via async streaming; Danbooru 337K Stage 2: 52.0h ($17.16)"
                }
            ],
            summary: "Cumulative latent pretraining (Stages 1+2) executes 65.65 EFLOPs at 75.6% avg MFU_act " +
                     "for $49.17 DiT ($53.20 inc. VAE), outperforming SDXL (0.406 GenEval / 72.40 DPG)."
        },
        "1MP": {
            title: "Native 1MP Scaling Study (1024², 337K Danbooru)",
            highlight: "89.0h at 1MP ($29.37) | 199.0h Total Danbooru ($65.67)",
            stats: [
                {
                    label: "Stage 3A/3B: 1MP Schedule (4096 tok)",
                    val: "36.0h Sparse + 53.0h Dense",
                    desc: "7.80 img/s (14.5% MFU_act) sparse vs 7.07 img/s (26.2% MFU_act) dense"
                },
                {
                    label: "Online Frozen VAE Wall",
                    val: "72.6% A40 / 62.0% 4090 Step",
                    desc: ">1.2 TB latents force live encoding; system MFU collapses to 3.66% on A40"
                },
                {
                    label: "Shallow Receptive-Field Limit",
                    val: "3.1% Area → Fractured Poses",
                    desc: "2 dense layers cover 3.1% at 1MP (vs 12.5% at 256²); dense 3B restores anatomy"
                }
            ],
            summary: "Empirical 1MP profiling on Danbooru motivates bypassing the online VAE wall via " +
                     "latent-to-pixel adaptation and starting 1MP SPRINT with a r=0.50 curriculum."
        },

        "pixel": {
            title: "Stage 3: Latent-to-Pixel DiP Adaptation (512²)",
            highlight: "57.65h RTX 4090 ($19.04) + 15.0h A40 Synth ($6.00)",
            stats: [
                {
                    label: "Stages 1–2B: Synthetic Transfer",
                    val: "23.65h on 100K Synth ($7.82)",
                    desc: "PDH warmup (2.25h) + SPRINT r=0.75 (12.0h, 57.7 img/s) + Dense (9.4h, 44.4 img/s)"
                },
                {
                    label: "Stage 3: Real-Data SFT (v-pred)",
                    val: "13 Ep · 34.0h ($11.22)",
                    desc: "396,635 real >=1024px images, r=0.00, 42.1 img/s, 66.2% MFU_act"
                },
                {
                    label: "Pixel Recovery & Inference Regime",
                    val: "GenEval 0.568 / DPG 75.31",
                    desc: "Recovers >95% of latent anchor; 3.34x faster at N=1 (crossover N* ≈ 12.25)"
                }
            ],
            summary: "Native v-prediction beats x0-prediction (0.568 vs 0.545 GenEval) with zero dynamic clipping, " +
                     "eliminating VAE decode overhead for few-step generation (N<=8) and future Flow-GRPO RL."
        }
    };

    const allButtons = [btn256, btn512, btn1MP, btnPixel].filter(Boolean);

    function renderStage(key, activeBtn) {
        allButtons.forEach((b) => b.classList.remove("active-sub"));
        if (activeBtn) activeBtn.classList.add("active-sub");

        const data = stageData[key];
        bannerTitle.textContent = data.title;
        if (bannerHighlight) bannerHighlight.textContent = data.highlight;
        bannerSummary.textContent = data.summary;

        bannerGrid.innerHTML = data.stats.map((s) => `
            <div class="banner-stat">
                <span class="stat-label">${s.label}</span>
                <span class="stat-val">${s.val}</span>
                <span class="stat-desc">${s.desc}</span>
            </div>
        `).join("");
    }

    btn256.onclick = () => renderStage("256", btn256);
    btn512.onclick = () => renderStage("512", btn512);
    btn1MP.onclick = () => renderStage("1MP", btn1MP);
    if (btnPixel) btnPixel.onclick = () => renderStage("pixel", btnPixel);
}

// 2. Section 4.1: Continuous RoPE Viewport & Reference Image Simulator
function initViewportSimulation() {
    const canvas = document.getElementById("viewportCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const zoomEl = document.getElementById("zoomInput");
    const xShiftEl = document.getElementById("xShiftInput");
    const yShiftEl = document.getElementById("yShiftInput");
    const zoomVal = document.getElementById("zoomVal");
    const xShiftVal = document.getElementById("xShiftVal");
    const yShiftVal = document.getElementById("yShiftVal");
    const imgUpload = document.getElementById("simImageUpload");
    const btnReset = document.getElementById("btnResetSim");
    const coordReadout = document.getElementById("simCoordReadout");

    let refImage = null;

    imgUpload.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                refImage = img;
                render();
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    };

    btnReset.onclick = () => {
        zoomEl.value = "1.0";
        xShiftEl.value = "0.0";
        yShiftEl.value = "0.0";
        render();
    };

    function render() {
        const zoom = parseFloat(zoomEl.value);
        const xShift = parseFloat(xShiftEl.value);
        const yShift = parseFloat(yShiftEl.value);

        zoomVal.textContent = zoom.toFixed(2);
        xShiftVal.textContent = xShift.toFixed(2);
        yShiftVal.textContent = yShift.toFixed(2);

        const W = canvas.width;
        const H = canvas.height;
        ctx.fillStyle = "#090b10";
        ctx.fillRect(0, 0, W, H);

        if (refImage) {
            ctx.drawImage(refImage, 0, 0, W, H);
            ctx.fillStyle = "rgba(9, 11, 16, 0.4)";
            ctx.fillRect(0, 0, W, H);
        } else {
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 1;
            const step = 20;
            for (let x = 0; x <= W; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let y = 0; y <= H; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }
        }

        // Canonical Viewport (Red Dashed Box) spans [-1, +1] x [-1, +1]
        const canonSize = W * 0.5;
        const canonX = (W - canonSize) / 2;
        const canonY = (H - canonSize) / 2;

        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.strokeRect(canonX, canonY, canonSize, canonSize);

        // Active Transformed Viewport (Blue Box) scaled to canonical span 2r_W
        const activeSize = canonSize / zoom;
        const activeX = canonX + (xShift * canonSize) - (activeSize - canonSize) / 2;
        const activeY = canonY + (yShift * canonSize) - (activeSize - canonSize) / 2;

        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
        ctx.fillRect(activeX, activeY, activeSize, activeSize);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(activeX, activeY, activeSize, activeSize);

        if (coordReadout) {
            const halfSpan = 1.0 / zoom;
            const xMin = (-halfSpan + 2.0 * xShift).toFixed(2);
            const xMax = (halfSpan + 2.0 * xShift).toFixed(2);
            const yMin = (-halfSpan + 2.0 * yShift).toFixed(2);
            const yMax = (halfSpan + 2.0 * yShift).toFixed(2);
            coordReadout.textContent = `Query: [${xMin}, ${xMax}] × [${yMin}, ${yMax}]`;
        }
    }

    zoomEl.addEventListener("input", render);
    xShiftEl.addEventListener("input", render);
    yShiftEl.addEventListener("input", render);
    render();
}

// 7. Section 1.1: SPRINT Compute & Memory Frontier Explorer
function initSprintFrontier() {
    const resGroup = document.getElementById("resBtnGroup");
    const dropGroup = document.getElementById("dropBtnGroup");
    const batchGroup = document.getElementById("batchBtnGroup");

    const metricTotalN = document.getElementById("metricTotalN");
    const metricGridSub = document.getElementById("metricGridSub");
    const metricActiveN = document.getElementById("metricActiveN");
    const metricActiveSub = document.getElementById("metricActiveSub");
    const metricFlopSavings = document.getElementById("metricFlopSavings");
    const metricAttnSub = document.getElementById("metricAttnSub");
    const metricVram = document.getElementById("metricVram");
    const metricVramSub = document.getElementById("metricVramSub");
    const canvas = document.getElementById("tokenGridCanvas");
    const alert1mp = document.getElementById("bottleneck1mpCard");

    if (!resGroup || !dropGroup || !batchGroup || !canvas) return;
    const ctx = canvas.getContext("2d");

    let activeRes = 512;
    let activeDrop = 0.75;
    let activeBatch = 64;

    function bindButtonGroup(group, callback) {
        group.querySelectorAll(".btn-pill").forEach((btn) => {
            btn.onclick = () => {
                group.querySelectorAll(".btn-pill").forEach((b) =>
                    b.classList.remove("active-pill")
                );
                btn.classList.add("active-pill");
                callback(btn);
                updateSimulation();
            };
        });
    }

    bindButtonGroup(resGroup, (btn) => {
        activeRes = parseInt(btn.dataset.res, 10);
    });

    bindButtonGroup(dropGroup, (btn) => {
        activeDrop = parseFloat(btn.dataset.drop);
    });

    bindButtonGroup(batchGroup, (btn) => {
        activeBatch = parseInt(btn.dataset.bs, 10);
    });

    function updateSimulation() {
        const patchDim = activeRes / 16;
        const totalN = patchDim * patchDim;
        const activeN = Math.round(totalN * (1.0 - activeDrop));

        // 1. Self-attention FLOP reduction across L=13 blocks (4 dense, 9 sparse)
        const denseAttn = 13.0 * totalN * totalN;
        const sparseAttn = 4.0 * totalN * totalN + 9.0 * activeN * activeN;
        const attnSavingsPct = Math.max(0, (1.0 - sparseAttn / denseAttn) * 100.0);

        // 2. Full DiT FLOP complexity (D=768, D_ffn=2048)
        const D = 768.0;
        const Dffn = 2048.0;
        const cDense = 13.0 * (2.0 * totalN * D * (2.0 * D + totalN + 4.0 * Dffn));
        const cSprint =
            4.0 * (2.0 * totalN * D * (2.0 * D + totalN + 4.0 * Dffn)) +
            9.0 * (2.0 * activeN * D * (2.0 * D + activeN + 4.0 * Dffn)) +
            (activeDrop > 0 ? 2.0 * totalN * D * D : 0.0);
        const totalSavingsPct = Math.max(0, (1.0 - cSprint / cDense) * 100.0);
        const arithSpeedup = (cDense / cSprint).toFixed(2);

        // 3. Peak VRAM calibrated (15.25 GB at 256^2, BS=64)
        // Base weights + optimizer states (~4.2 GB) + selective SwiGLU checkpointed activations
        const weightOptBase = 5.5;
        const denseActAt256Bs64 = 9.75; // 5.5 + 9.75 = 15.25 GB 
        const avgTokensSample = (4.0 / 13.0) * totalN + (9.0 / 13.0) * activeN + 228.0;
        const actScale = (avgTokensSample / (256.0 + 228.0)) * (activeBatch / 64.0);
        const estVram = weightOptBase + denseActAt256Bs64 * actScale;

        metricTotalN.textContent = `${totalN.toLocaleString()} tokens`;
        if (metricGridSub) metricGridSub.textContent = `${patchDim} × ${patchDim} Patch Grid`;
        metricActiveN.textContent = `${activeN.toLocaleString()} tokens`;
        if (metricActiveSub) {
            const pct = Math.round((1.0 - activeDrop) * 100);
            metricActiveSub.textContent = `9 Sparse Blocks (${pct}%)`;
        }
        metricFlopSavings.textContent =
            activeDrop === 0 ? "0.0% (1.00×)" : `${totalSavingsPct.toFixed(1)}% (${arithSpeedup}×)`;
        if (metricAttnSub) {
            metricAttnSub.textContent = `Self-Attn FLOPs: -${attnSavingsPct.toFixed(1)}%`;
        }

        if (estVram > 24.0) {
            metricVram.textContent = `${estVram.toFixed(1)} GB (OOM)`;
            metricVram.className = "f-val text-danger";
            if (metricVramSub) metricVramSub.textContent = "Exceeds 24 GB 4090 VRAM";
        } else {
            metricVram.textContent = `${estVram.toFixed(1)} GB`;
            metricVram.className = "f-val";
            if (metricVramSub) metricVramSub.textContent = "Fits 24 GB (SwiGLU Ckpt)";
        }

        if (activeRes === 1024) {
            alert1mp.classList.remove("hidden-alert");
        } else {
            alert1mp.classList.add("hidden-alert");
        }

        renderTokenGrid(patchDim);
    }

    function renderTokenGrid(gridDim) {
        const W = canvas.width;
        const H = canvas.height;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);

        const cellSize = W / gridDim;
        for (let gy = 0; gy < gridDim; gy += 2) {
            for (let gx = 0; gx < gridDim; gx += 2) {
                const subCells = [
                    { x: gx, y: gy },
                    { x: gx + 1, y: gy },
                    { x: gx, y: gy + 1 },
                    { x: gx + 1, y: gy + 1 }
                ];

                let numActive = 4;
                if (activeDrop === 0.50) numActive = 2;
                if (activeDrop === 0.75) numActive = 1;
                if (activeDrop === 0.875) numActive = (gx % 4 === 0 && gy % 4 === 0) ? 1 : 0;

                subCells.forEach((c, idx) => {
                    const isActive = idx < numActive;
                    ctx.fillStyle = isActive ? "#38bdf8" : "#450a0a";
                    ctx.fillRect(
                        c.x * cellSize + 0.5,
                        c.y * cellSize + 0.5,
                        cellSize - 1,
                        cellSize - 1
                    );
                });
            }
        }
    }

    updateSimulation();
}


// 8. Section 4.2: RoPE Phase Shift & Attention Kernel Inspector
function initRopeInspector() {
    const kCanvas = document.getElementById("kernelCanvas");
    const cCanvas = document.getElementById("curveCanvas");
    const badgeProbe = document.getElementById("probeCoordsBadge");
    const badgeMaxDeg = document.getElementById("maxDegBadge");
    const diagText = document.getElementById("ropeDiagnosis");

    const btnA = document.getElementById("btnRopeModeA");
    const btnB = document.getElementById("btnRopeModeB");
    const btnC = document.getElementById("btnRopeModeC");

    if (!kCanvas || !cCanvas) return;
    const kCtx = kCanvas.getContext("2d");
    const cCtx = cCanvas.getContext("2d");

    let currentMode = "C";
    let probeX = 8;
    let probeY = 8;
    const dim = 16;
    const numFreqs = dim / 2; // 8 channels

    // Standard RoPE Inverse Frequencies
    const freqsStd = [];
    for (let k = 0; k < numFreqs; k++) {
        freqsStd.push(1.0 / Math.pow(10000.0, (2 * k) / dim));
    }

    // Calibrated HDM Spatial Frequencies: [2*pi -> pi/4]
    const freqsHdm = [];
    const logMax = Math.log(2.0 * Math.PI);
    const logMin = Math.log(Math.PI / 4.0);
    for (let k = 0; k < numFreqs; k++) {
        const val = Math.exp(logMax - (k / (numFreqs - 1)) * (logMax - logMin));
        freqsHdm.push(val);
    }

    function setMode(mode, btn) {
        currentMode = mode;
        [btnA, btnB, btnC].forEach((b) => b.classList.remove("active-preset"));
        btn.classList.add("active-preset");
        render();
    }

    btnA.onclick = () => setMode("A", btnA);
    btnB.onclick = () => setMode("B", btnB);
    btnC.onclick = () => setMode("C", btnC);

    kCanvas.onmousedown = (e) => {
        const rect = kCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const cellSize = kCanvas.width / 16;
        probeX = Math.min(15, Math.max(0, Math.floor(mouseX / cellSize)));
        probeY = Math.min(15, Math.max(0, Math.floor(mouseY / cellSize)));
        render();
    };

    function render() {
        badgeProbe.textContent = `Probe: (${probeX}, ${probeY})`;

        // 1. Draw Attention Kernel Heatmap
        const W = kCanvas.width;
        const H = kCanvas.height;
        const cellSize = W / 16;

        let deltaUnit = 1.0;
        let deltaNorm = 0.125; // 2 / 16 normalized patch step

        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                let diffY = 0, diffX = 0, activeFreqs = freqsStd;

                if (currentMode === "A") {
                    diffY = (y - probeY) * deltaUnit;
                    diffX = (x - probeX) * deltaUnit;
                    activeFreqs = freqsStd;
                } else if (currentMode === "B") {
                    diffY = (y - probeY) * deltaNorm;
                    diffX = (x - probeX) * deltaNorm;
                    activeFreqs = freqsStd;
                } else if (currentMode === "C") {
                    diffY = (y - probeY) * deltaNorm;
                    diffX = (x - probeX) * deltaNorm;
                    activeFreqs = freqsHdm;
                }

                let sumCosY = 0, sumCosX = 0;
                for (let k = 0; k < numFreqs; k++) {
                    sumCosY += Math.cos(diffY * activeFreqs[k]);
                    sumCosX += Math.cos(diffX * activeFreqs[k]);
                }
                const kernelVal = 0.5 * (sumCosY / numFreqs + sumCosX / numFreqs);

                // Map [-0.2, 1.0] to Inferno Colormap Approximation
                kCtx.fillStyle = getInfernoColor(kernelVal);
                kCtx.fillRect(
                    x * cellSize,
                    y * cellSize,
                    cellSize - 0.5,
                    cellSize - 0.5
                );
            }
        }

        // Draw Probe Star at (probeX, probeY)
        const starX = probeX * cellSize + cellSize / 2;
        const starY = probeY * cellSize + cellSize / 2;
        drawStar(kCtx, starX, starY, 5, 8, 4, "#38bdf8");

        // 2. Draw Rotation Phase Curve Graph
        cCtx.fillStyle = "#090b10";
        cCtx.fillRect(0, 0, 280, 280);

        // Grid lines
        cCtx.strokeStyle = "#1e293b";
        cCtx.lineWidth = 1;
        for (let d = 0; d <= 90; d += 30) {
            const yPos = 250 - (d / 90.0) * 220;
            cCtx.beginPath();
            cCtx.moveTo(35, yPos);
            cCtx.lineTo(265, yPos);
            cCtx.stroke();
            cCtx.fillStyle = "#64748b";
            cCtx.font = "9px monospace";
            cCtx.fillText(`${d}°`, 10, yPos + 3);
        }

        // Compute Phase Shifts Across Channels
        const degA = freqsStd.map((f) => f * deltaUnit * (180.0 / Math.PI));
        const degB = freqsStd.map((f) => f * deltaNorm * (180.0 / Math.PI));
        const degC = freqsHdm.map((f) => f * deltaNorm * (180.0 / Math.PI));

        plotCurve(cCtx, degA, "#4ade80");
        plotCurve(cCtx, degB, "#f87171");
        plotCurve(cCtx, degC, "#c084fc");

        if (currentMode === "A") {
            badgeMaxDeg.textContent = `Max: ${degA[0].toFixed(1)}°`;
            diagText.innerHTML =
                "<strong>Mode A (Discrete RoPE):</strong> Standard integer indexing provides " +
                "spatial decay on fixed square grids, but unseen indices on non-square aspect " +
                "ratios trigger harmonic repetition (duplicated heads and fragmented torsos).";
        } else if (currentMode === "B") {
            badgeMaxDeg.textContent = `Max: ${degB[0].toFixed(1)}° (Collapse)`;
            diagText.innerHTML =
                "<strong>Mode B (Broken Continuous RoPE):</strong> Normalized coordinates shrink " +
                "adjacent steps to &Delta;p = 0.125 at 256<sup>2</sup>. Standard frequencies rotate by " +
                "&lt;7.16&deg;, causing phase collapse (<i>K</i> &rarr; 1.0 - O(N<sub>H</sub><sup>-2</sup>)).";
        } else {
            badgeMaxDeg.textContent = `Max: ${degC[0].toFixed(1)}° (Calibrated)`;
            diagText.innerHTML =
                "<strong>Mode C (Calibrated Continuous RoPE):</strong> Parameter-free frequencies " +
                "&omega;<sub>k</sub> are scaled log-linearly from 2&pi; down to &pi;/4 " +
                "(<code>register_buffer</code>). Restores 45.0&deg; adjacent rotation and sharp " +
                "isotropic radial decay without optimizer overhead.";
        }
    }

    function plotCurve(ctx, data, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.forEach((val, idx) => {
            const x = 40 + (idx / 7.0) * 215;
            const y = 250 - Math.min(220, (val / 90.0) * 220);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw points
        data.forEach((val, idx) => {
            const x = 40 + (idx / 7.0) * 215;
            const y = 250 - Math.min(220, (val / 90.0) * 220);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function getInfernoColor(val) {
        // Linear clamped normalizer [-0.2, 1.0] -> [0, 1]
        const norm = Math.max(0, Math.min(1, (val + 0.2) / 1.2));
        const r = Math.round(Math.pow(norm, 1.2) * 255);
        const g = Math.round(Math.pow(norm, 2.5) * 240);
        const b = Math.round(Math.sin(norm * Math.PI) * 160 + (norm > 0.8 ? 80 : 0));
        return `rgb(${r}, ${g}, ${b})`;
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = (Math.PI / 2) * 3;
        let x = cx, y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    render();
}
// 3. Section 5.1: Resolution, RoPE & SPRINT Curtain Slider
function initCurtainSlider() {
    const slider = document.getElementById("curtainSlider");
    const beforeWrap = document.getElementById("curtainBeforeWrap");
    const divider = document.getElementById("curtainDivider");
    const imgBefore = document.getElementById("curtainBefore");
    const imgAfter = document.getElementById("curtainAfter");
    const badgeBefore = document.getElementById("badgeBefore");
    const badgeAfter = document.getElementById("badgeAfter");
    const curtainCaption = document.getElementById("curtainCaption");

    const btnRes = document.getElementById("btnPresetRes");
    const btnRope = document.getElementById("btnPresetRope");
    const btnSprint = document.getElementById("btnPresetSprint");
    const btn1MP = document.getElementById("btnPreset1MP");

    if (!slider || !beforeWrap || !divider) return;

    slider.addEventListener("input", (e) => {
        const val = e.target.value;
        beforeWrap.style.width = `${val}%`;
        divider.style.left = `${val}%`;
    });

    function setPreset(activeBtn, beforeSrc, afterSrc, bText, aText, capHtml) {
        [btnRes, btnRope, btnSprint, btn1MP].forEach((b) => {
            if (b) b.classList.remove("active-preset");
        });
        activeBtn.classList.add("active-preset");
        imgBefore.src = beforeSrc;
        imgAfter.src = afterSrc;
        badgeBefore.textContent = bText;
        badgeAfter.textContent = aText;
        if (curtainCaption && capHtml) curtainCaption.innerHTML = capHtml;
        slider.value = 50;
        beforeWrap.style.width = "50%";
        divider.style.left = "50%";
    }

    btnRes.onclick = () => setPreset(
        btnRes,
        "images/sample_akane.png",
        "images/sample_512_akane.png",
        "256px Base",
        "512px Adapted",
        "<strong>Canvas Scaling (256<sup>2</sup> &rarr; 512<sup>2</sup>):</strong> Adapting to 512&times;512 " +
        "resolves intricate floral kimono patterns, umbrella ribs, and crisp iris highlights while " +
        "preserving global pose and color harmony."
    );

    btnRope.onclick = () => setPreset(
        btnRope,
        "images/comparisons/rope_not_calibrated_shirt.png",
        "images/comparisons/rope_calibrated_shirt.png",
        "Discrete RoPE Collapse",
        "Continuous Calibrated",
        "<strong>Mid-Flight RoPE Adaptation:</strong> Discrete integer IDs " +
        "replicate heads on unseen aspect ratios; switching to calibrated continuous coordinates " +
        "(&omega; &isin; [&pi;/4, 2&pi;]) eliminates tiling within 20 epochs (5.6 GPU hours)."
    );

    btnSprint.onclick = () => setPreset(
        btnSprint,
        "images/comparisons/hoshino_ai_dropped.png",
        "images/comparisons/hoshino_ai_fined.png",
        "0.75 Drop Sparse",
        "Dense Token Refined",
        "<strong>SPRINT Sparse-to-Dense Recovery:</strong> 75% structured token dropping " +
        "establishes pose and color blocking at &gt;50% FLOP savings; dense refinement re-engages all " +
        "1,024 tokens to resolve eye iris stars and sharp lineart."
    );

    if (btn1MP) {
        btn1MP.onclick = () => setPreset(
            btn1MP,
            "images/comparisons/sample_1MP_drop_yuri_claire.png",
            "images/comparisons/sample_1MP_dense_yuri_claire.png",
            "1MP: 0.75 Drop (3 Ep)",
            "1MP: Dense FT (4 Ep)",
            "<strong>Native 1MP Receptive-Field Limit:</strong> At 1024<sup>2</sup>, " +
            "2 shallow dense layers span only 3.1% of the canvas (32px stride), fracturing multi-character " +
            "anatomy until Phase 3B dense fine-tuning restores clean separation."
        );
    }
}


// Section 5.2: Virtual Camera Flight (Full-Frame Viewport)
function initCameraCarousel() {
    const btnDomainReal = document.getElementById("btnCamDomainReal");
    const btnDomainAnime = document.getElementById("btnCamDomainAnime");
    const btnDomainFail = document.getElementById("btnCamDomainFailures");
    const paneFlight = document.getElementById("camFlightPane");
    const paneFailures = document.getElementById("camFailurePane");

    const mainImg = document.getElementById("flightMainImg");
    const fallbackBox = document.getElementById("flightImgFallback");
    const telemetry = document.getElementById("cameraTelemetry");
    const caption = document.getElementById("cameraCaption");
    const stepsRow = document.getElementById("flightStepsRow");
    const btnPrev = document.getElementById("btnCaroPrev");
    const btnNext = document.getElementById("btnCaroNext");
    const btnTrajX = document.getElementById("btnTrajX");
    const btnTrajY = document.getElementById("btnTrajY");
    const btnTrajZoom = document.getElementById("btnTrajZoom");

    if (!mainImg || !telemetry || !stepsRow || !btnDomainReal) return;

    const domainData = {
        real: {
            x: {
                tabLabel: "X-Shift: Dachshund",
                defaultIdx: 1,
                caption:
                    "<strong>Horizontal Panning:</strong> Shifting " +
                    "<code>x_shift = +0.25</code> pans the viewport rightward, framing " +
                    "the dachshund toward the left edge without altering knit cap details " +
                    "or snow geometry.",
                items: [
                    {
                        src: "images/camera/dog_x_neg.png",
                        label: "X: -0.25 (Camera Left)",
                        meta: "Zoom: 1.00x | X: -0.25 | Y: 0.00 | Open-Domain 512px",
                    },
                    {
                        src: "images/camera/dog_x_center.png",
                        label: "X: 0.00 (Center)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: 0.00 | Open-Domain 512px",
                    },
                    {
                        src: "images/camera/dog_x_pos.png",
                        label: "X: +0.25 (Camera Right)",
                        meta: "Zoom: 1.00x | X: +0.25 | Y: 0.00 | Open-Domain 512px",
                    }
                ]
            },
            y: {
                tabLabel: "Y-Shift: Wedding Cake",
                defaultIdx: 1,
                caption:
                    "<strong>Vertical Framing:</strong> Matrix row-major coordinates " +
                    "map <code>y_shift = -0.25</code> upward (resolving upper floral tiers and " +
                    "the chandelier) and <code>y_shift = +0.25</code> downward (grounding the " +
                    "ornate metallic pedestal).",
                items: [
                    {
                        src: "images/camera/cake_y_up.png",
                        label: "Y: -0.25 (Camera Up)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: -0.25 | Open-Domain 512px",
                    },
                    {
                        src: "images/camera/cake_y_center.png",
                        label: "Y: 0.00 (Center)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: 0.00 | Open-Domain 512px",
                    },
                    {
                        src: "images/camera/cake_y_down.png",
                        label: "Y: +0.25 (Camera Down)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: +0.25 | Open-Domain 512px",
                    }
                ]
            },
            zoom: {
                tabLabel: "Zoom: Rose Wreath",
                defaultIdx: 1,
                caption:
                    "<strong>Continuous Optical Zoom:</strong> Contracting the " +
                    "continuous evaluation grid concentrates transformer attention onto fine " +
                    "rose petal contours and porcelain teacup glazes without geometric collapse " +
                    "(reliable up to 1.30&times; on general multi-element compositions).",
                items: [
                    {
                        src: "images/camera/heart_zoom_0_75.png",
                        label: "Zoom: 0.75x (Wide)",
                        meta: "Zoom: 0.75x | X: 0.00 | Y: 0.00 | Open-Domain 512px",
                    },
                    {
                        src: "images/camera/heart_zoom.png",
                        label: "Zoom: 1.00x (Base)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: 0.00 | Open-Domain 512px",
                    },
                    {
                        src: "images/camera/heart_zoom_1_25.png",
                        label: "Zoom: 1.25x (Focal In)",
                        meta: "Zoom: 1.25x | X: 0.00 | Y: 0.00 | Open-Domain 512px",
                    }
                ]
            }
        },
        anime: {
            x: {
                tabLabel: "X-Shifts (Maid Asuka)",
                defaultIdx: 1,
                caption:
                    "<strong>Anime Domain Horizontal Pan (Danbooru 337K):</strong> " +
                    "Multi-aspect pretraining (1:2 to 21:9) exposes the entire continuous RoPE " +
                    "manifold [-<i>r</i><sub>H</sub>, <i>r</i><sub>H</sub>] &times; " +
                    "[-<i>r</i><sub>W</sub>, <i>r</i><sub>W</sub>], yielding clean panning.",
                items: [
                    {
                        src: "images/camera/maid_asuka_x_neg.png",
                        label: "X: -0.30 (Camera Left)",
                        meta: "Zoom: 1.00x | X: -0.30 | Y: 0.00 | CFG: 4.5 (Anime)",
                    },
                    {
                        src: "images/camera/maid_asuka.png",
                        label: "X: 0.00 (Center)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: 0.00 | CFG: 4.5 (Anime)",
                    },
                    {
                        src: "images/camera/maid_asuka_x_pos.png",
                        label: "X: +0.30 (Camera Right)",
                        meta: "Zoom: 1.00x | X: +0.30 | Y: 0.00 | CFG: 4.5 (Anime)",
                    }
                ]
            },
            y: {
                tabLabel: "Y-Shifts (Yachiyo)",
                defaultIdx: 1,
                caption:
                    "<strong>Anime Domain Vertical Framing (Row-Major Convention):</strong> " +
                    "Negative <code>y_shift = -0.30</code> elevates the virtual camera upward, " +
                    "while positive <code>y_shift = +0.30</code> lowers the viewport.",
                items: [
                    {
                        src: "images/camera/yachiyo_y_pos.png",
                        label: "Y: -0.30 (Camera Up)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: -0.30 | CFG: 9.0 (Anime)",
                    },
                    {
                        src: "images/camera/yachiyo.png",
                        label: "Y: 0.00 (Center)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: 0.00 | CFG: 9.0 (Anime)",
                    },
                    {
                        src: "images/camera/yachiyo_y_neg.png",
                        label: "Y: +0.30 (Camera Down)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: +0.30 | CFG: 9.0 (Anime)",
                    }
                ]
            },
            zoom: {
                tabLabel: "Zoom (Red Bodysuit Asuka)",
                defaultIdx: 0,
                caption:
                    "<strong>Anime Multi-Character Focal Zoom:</strong> " +
                    "Compressing the continuous coordinate mesh zooms smoothly into dual-subject " +
                    "illustrations under identical noise seeds without auxiliary tokens.",
                items: [
                    {
                        src: "images/camera/red_bodysuit_zoom_0_75.png",
                        label: "Zoom: 0.75x (Wide)",
                        meta: "Zoom: 0.75x | X: 0.00 | Y: 0.00 | CFG: 9.0 (Anime)",
                    },
                    {
                        src: "images/camera/red_bodysuit.png",
                        label: "Zoom: 1.00x (Base)",
                        meta: "Zoom: 1.00x | X: 0.00 | Y: 0.00 | CFG: 9.0 (Anime)",
                    },
                    {
                        src: "images/camera/red_bodysuit_zoom_1_25.png",
                        label: "Zoom: 1.25x (Focal In)",
                        meta: "Zoom: 1.25x | X: 0.00 | Y: 0.00 | CFG: 9.0 (Anime)",
                    }
                ]
            }
        }
    };

    let activeDomain = "real";
    let activeTraj = "x";
    let activeIdx = 1;

    mainImg.onerror = () => {
        const items = domainData[activeDomain][activeTraj].items;
        const current = items[activeIdx];
        mainImg.style.display = "none";
        if (fallbackBox) {
            fallbackBox.innerHTML =
                `<strong>Missing Paper Figure Asset</strong><br>` +
                `${current.fallbackNote} <code>${current.src}</code>.`;
            fallbackBox.classList.remove("hidden-pane");
        }
    };

    mainImg.onload = () => {
        mainImg.style.display = "block";
        mainImg.style.opacity = "1.0";
        if (fallbackBox) fallbackBox.classList.add("hidden-pane");
    };

    function renderStage() {
        const trajObj = domainData[activeDomain][activeTraj];
        const items = trajObj.items;
        const current = items[activeIdx];

        btnTrajX.textContent = domainData[activeDomain].x.tabLabel;
        btnTrajY.textContent = domainData[activeDomain].y.tabLabel;
        btnTrajZoom.textContent = domainData[activeDomain].zoom.tabLabel;

        if (fallbackBox) fallbackBox.classList.add("hidden-pane");
        mainImg.style.display = "block";
        mainImg.style.opacity = "0.4";
        mainImg.src = current.src;

        telemetry.textContent = current.meta;
        if (caption) caption.innerHTML = trajObj.caption;

        stepsRow.innerHTML = "";
        items.forEach((item, idx) => {
            const pill = document.createElement("button");
            pill.className = `flight-step-btn ${
                idx === activeIdx ? "active-step" : ""
            }`;
            pill.textContent = item.label;
            pill.onclick = () => {
                activeIdx = idx;
                renderStage();
            };
            stepsRow.appendChild(pill);
        });
    }

    function switchDomain(domainKey, activeBtn) {
        [btnDomainReal, btnDomainAnime, btnDomainFail].forEach((b) => {
            if (b) b.classList.remove("active-preset");
        });
        activeBtn.classList.add("active-preset");

        if (domainKey === "failures") {
            if (paneFlight) paneFlight.classList.add("hidden-pane");
            if (paneFailures) paneFailures.classList.remove("hidden-pane");
            return;
        }

        if (paneFailures) paneFailures.classList.add("hidden-pane");
        if (paneFlight) paneFlight.classList.remove("hidden-pane");

        activeDomain = domainKey;
        activeTraj = "x";
        activeIdx = domainData[activeDomain].x.defaultIdx;
        [btnTrajX, btnTrajY, btnTrajZoom].forEach((b) =>
            b.classList.remove("active-preset")
        );
        btnTrajX.classList.add("active-preset");
        renderStage();
    }

    function switchTraj(key, activeBtn) {
        activeTraj = key;
        activeIdx = domainData[activeDomain][key].defaultIdx;
        [btnTrajX, btnTrajY, btnTrajZoom].forEach((b) =>
            b.classList.remove("active-preset")
        );
        activeBtn.classList.add("active-preset");
        renderStage();
    }

    btnDomainReal.onclick = () => switchDomain("real", btnDomainReal);
    btnDomainAnime.onclick = () => switchDomain("anime", btnDomainAnime);
    if (btnDomainFail) {
        btnDomainFail.onclick = () => switchDomain("failures", btnDomainFail);
    }

    btnTrajX.onclick = () => switchTraj("x", btnTrajX);
    btnTrajY.onclick = () => switchTraj("y", btnTrajY);
    btnTrajZoom.onclick = () => switchTraj("zoom", btnTrajZoom);

    btnPrev.onclick = () => {
        const len = domainData[activeDomain][activeTraj].items.length;
        activeIdx = (activeIdx - 1 + len) % len;
        renderStage();
    };

    btnNext.onclick = () => {
        const len = domainData[activeDomain][activeTraj].items.length;
        activeIdx = (activeIdx + 1) % len;
        renderStage();
    };

    renderStage();
}


// 5. Section 5.3: Semantic Disentanglement & Style Inspector
function initDisentangleTabs() {
    const btnColor = document.getElementById("btnTabColor");
    const btnStyle = document.getElementById("btnTabStyle");
    const paneColor = document.getElementById("disentangleColorPane");
    const paneStyle = document.getElementById("disentangleStylePane");

    const imgA = document.getElementById("styleImgA");
    const imgB = document.getElementById("styleImgB");
    const tagA = document.getElementById("styleTagA");
    const tagB = document.getElementById("styleTagB");
    const caption = document.getElementById("styleCaption");
    const pairsRow = document.getElementById("stylePairsRow");

    if (!btnColor || !btnStyle || !pairsRow) return;

    btnColor.onclick = () => {
        btnColor.classList.add("active-preset");
        btnStyle.classList.remove("active-preset");
        paneColor.classList.remove("hidden-pane");
        paneStyle.classList.add("hidden-pane");
    };

    btnStyle.onclick = () => {
        btnStyle.classList.add("active-preset");
        btnColor.classList.remove("active-preset");
        paneStyle.classList.remove("hidden-pane");
        paneColor.classList.add("hidden-pane");
    };

    const stylePairs = [
        {
            title: "Albedo: Anime Coloring vs. Compound Artists",
            srcA: "images/comparisons/albedo_anime.png",
            tagA: "Albedo: Anime Coloring",
            srcB: "images/comparisons/albedo_artists_small.png",
            tagB: "Albedo: Compound Artist Tags",
            caption:
                "Without aesthetic SFT, generic quality tags produce flat cel-shading (left). " +
                "Adding compound artist descriptors resolves dark wing plumage, gold filigree " +
                "embroidery, and volumetric rim lighting while preserving pose and facial identity."
        },
        {
            title: "Asuka: Painterly Contrast vs. Soft Lineart",
            srcA: "images/comparisons/asuka_artists_1_small.png",
            tagA: "Asuka: Styling Variant A",
            srcB: "images/comparisons/asuka_artists_2_small.png",
            tagB: "Asuka: Styling Variant B",
            caption:
                "Different artist combinations modulate shading gradients and hair translucency " +
                "under identical random seeds: Variant A emphasizes high-contrast painterly brushstrokes, " +
                "while Variant B softens lineart with translucent hair fringe without disrupting the red plugsuit."
        }
    ];

    let activePairIdx = 0;

    function renderFeaturedPair() {
        const pair = stylePairs[activePairIdx];
        imgA.src = pair.srcA;
        imgB.src = pair.srcB;
        tagA.textContent = pair.tagA;
        tagB.textContent = pair.tagB;
        caption.textContent = pair.caption;

        pairsRow.innerHTML = "";
        stylePairs.forEach((p, idx) => {
            const card = document.createElement("div");
            card.className = `style-pair-card ${
                idx === activePairIdx ? "active-pair" : ""
            }`;
            card.innerHTML = `
                <div class="pair-thumbs">
                    <img src="${p.srcA}" alt="${p.tagA}" loading="lazy">
                    <img src="${p.srcB}" alt="${p.tagB}" loading="lazy">
                </div>
                <span>${p.title}</span>
            `;
            card.onclick = () => {
                activePairIdx = idx;
                renderFeaturedPair();
            };
            pairsRow.appendChild(card);
        });
    }

    renderFeaturedPair();
}


// 6. Section 5.4: Interactive VAE Rollout Bottleneck Calculator
function initBottleneckCalculator() {
    const sliderG = document.getElementById("inputGroupSize");
    const labelG = document.getElementById("valGroupSize");
    const outLatent = document.getElementById("valLatentTime");
    const outPixel = document.getElementById("valPixelTime");
    const outVaeShare = document.getElementById("valVaeShare");
    const outSpeedup = document.getElementById("valSpeedup");

    if (!sliderG) return;

    function recalculate() {
        const G = parseInt(sliderG.value, 10);
        labelG.textContent = G;

        // Constants: DiT forward ~24ms/step over 10 steps = 240ms
        const ditForwardTime = 240;
        // FLUX.2 VAE decode = ~45ms per image rollout
        const vaeDecodePerCandidate = 45;
        // DiP Patch Detailer Head adds ~4.5ms per candidate directly in-graph
        const pdhPerCandidate = 4.5;

        const totalVaeTime = G * vaeDecodePerCandidate;
        const latentTotal = ditForwardTime + totalVaeTime;
        const pixelTotal = ditForwardTime + Math.round(G * pdhPerCandidate);

        const vaeSharePct = Math.round((totalVaeTime / latentTotal) * 100);
        const speedup = (latentTotal / pixelTotal).toFixed(2);

        outLatent.textContent = `${latentTotal} ms`;
        outVaeShare.textContent = `VAE Decode: ${vaeSharePct}% of total`;
        outPixel.textContent = `${pixelTotal} ms`;
        outSpeedup.textContent = `${speedup}x`;
    }

    sliderG.addEventListener("input", recalculate);
    recalculate();
}


function initShiftCropVisualizer() {
    const srcCanvas = document.getElementById("sourceCanvas");
    const cropCanvas = document.getElementById("croppedCanvas");
    if (!srcCanvas || !cropCanvas) return;

    const ctxSrc = srcCanvas.getContext("2d");
    const ctxCrop = cropCanvas.getContext("2d");

    const fileInput = document.getElementById("cropImageUpload");
    const btnDice = document.getElementById("btnRollDice");
    const wSlider = document.getElementById("cropWInput");
    const hSlider = document.getElementById("cropHInput");
    const wVal = document.getElementById("cropWVal");
    const hVal = document.getElementById("cropHVal");
    const toggleGrid = document.getElementById("togglePatchGrid");

    const srcDimsLabel = document.getElementById("resSourceDims");
    const cropDimsLabel = document.getElementById("cropWindowDims");
    const teleOffset = document.getElementById("teleOffset");
    const teleRH = document.getElementById("teleRH");
    const teleRW = document.getElementById("teleRW");
    const teleRoPE = document.getElementById("teleRoPE");
    const teleStaticStatus = document.getElementById("teleStaticStatus");

    let sourceImg = new Image();
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let isAnimating = false;

    // Generate procedural anime-style gradient placeholder if no image loaded
    function loadDefaultImage() {
        const off = document.createElement("canvas");
        off.width = 384;
        off.height = 512;
        const offCtx = off.getContext("2d");

        const grad = offCtx.createLinearGradient(0, 0, 384, 512);
        grad.addColorStop(0, "#1e1b4b");
        grad.addColorStop(0.5, "#4338ca");
        grad.addColorStop(1, "#f43f5e");
        offCtx.fillStyle = grad;
        offCtx.fillRect(0, 0, 384, 512);

        // Simple visual landmark geometry
        offCtx.fillStyle = "#ffffff";
        offCtx.beginPath();
        offCtx.arc(192, 180, 70, 0, Math.PI * 2);
        offCtx.fill();

        offCtx.fillStyle = "#fb7185";
        offCtx.beginPath();
        offCtx.arc(165, 175, 12, 0, Math.PI * 2);
        offCtx.arc(219, 175, 12, 0, Math.PI * 2);
        offCtx.fill();

        sourceImg.src = off.toDataURL();
    }

    sourceImg.onload = () => updateGeometry(true);
    loadDefaultImage();

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            sourceImg = new Image();
            sourceImg.onload = () => updateGeometry(true);
            sourceImg.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    };

    function getCropDims() {
        return {
            w: parseInt(wSlider.value, 10),
            h: parseInt(hSlider.value, 10)
        };
    }

    function calculateResizedBounds(cropW, cropH) {
        const origW = sourceImg.naturalWidth || 384;
        const origH = sourceImg.naturalHeight || 512;
        // Scale shorter edge to guarantee target dimensions fit inside
        const scale = Math.max(cropW / origW, cropH / origH);
        const resW = Math.round(origW * scale);
        const resH = Math.round(origH * scale);
        return { resW, resH, maxOffX: resW - cropW, maxOffY: resH - cropH };
    }

    function updateGeometry(resetPos = false) {
        const { w: cropW, h: cropH } = getCropDims();
        wVal.textContent = cropW;
        hVal.textContent = cropH;
        cropDimsLabel.textContent = `${cropW} × ${cropH}`;

        const { resW, resH, maxOffX, maxOffY } =
            calculateResizedBounds(cropW, cropH);
        srcDimsLabel.textContent = `${resW} × ${resH}`;

        if (resetPos) {
            targetX = Math.floor(maxOffX / 2);
            targetY = Math.floor(maxOffY / 2);
            currentX = targetX;
            currentY = targetY;
        } else {
            targetX = Math.min(targetX, maxOffX);
            targetY = Math.min(targetY, maxOffY);
        }

        renderCanvases();
    }

    function rollDice() {
        const { w: cropW, h: cropH } = getCropDims();
        const { maxOffX, maxOffY } = calculateResizedBounds(cropW, cropH);

        targetX = Math.floor(Math.random() * (maxOffX + 1));
        targetY = Math.floor(Math.random() * (maxOffY + 1));

        btnDice.classList.add("rolling");
        setTimeout(() => btnDice.classList.remove("rolling"), 400);

        if (!isAnimating) {
            isAnimating = true;
            animateCropBox();
        }
    }

    btnDice.onclick = rollDice;
    wSlider.oninput = () => updateGeometry(false);
    hSlider.oninput = () => updateGeometry(false);
    toggleGrid.onchange = renderCanvases;

    function animateCropBox() {
        const lerp = 0.25;
        currentX += (targetX - currentX) * lerp;
        currentY += (targetY - currentY) * lerp;

        if (Math.abs(targetX - currentX) < 0.5 &&
            Math.abs(targetY - currentY) < 0.5) {
            currentX = targetX;
            currentY = targetY;
            isAnimating = false;
            renderCanvases();
            return;
        }

        renderCanvases();
        requestAnimationFrame(animateCropBox);
    }

    function renderCanvases() {
        const { w: cropW, h: cropH } = getCropDims();
        const { resW, resH } = calculateResizedBounds(cropW, cropH);

        // 1. Draw Left Canvas (Resized Source + Viewport Box)
        srcCanvas.width = 360;
        srcCanvas.height = 360;

        const displayScale = Math.min(360 / resW, 360 / resH);
        const drawW = resW * displayScale;
        const drawH = resH * displayScale;
        const offCanvasX = (360 - drawW) / 2;
        const offCanvasY = (360 - drawH) / 2;

        ctxSrc.fillStyle = "#090b10";
        ctxSrc.fillRect(0, 0, 360, 360);
        ctxSrc.drawImage(sourceImg, offCanvasX, offCanvasY, drawW, drawH);

        // Highlight crop area
        const boxX = offCanvasX + currentX * displayScale;
        const boxY = offCanvasY + currentY * displayScale;
        const boxW = cropW * displayScale;
        const boxH = cropH * displayScale;

        // Subtle alpha wash
        ctxSrc.fillStyle = "rgba(239, 68, 68, 0.22)";
        ctxSrc.fillRect(boxX, boxY, boxW, boxH);
        ctxSrc.strokeStyle = "#ef4444";
        ctxSrc.lineWidth = 2;
        ctxSrc.strokeRect(boxX, boxY, boxW, boxH);

        // 2. Draw Right Canvas (Extracted Patch)
        cropCanvas.width = cropW;
        cropCanvas.height = cropH;

        ctxCrop.fillStyle = "#090b10";
        ctxCrop.fillRect(0, 0, cropW, cropH);

        const origW = sourceImg.naturalWidth || 384;
        const origH = sourceImg.naturalHeight || 512;
        const srcScale = Math.max(cropW / origW, cropH / origH);
        const sx = currentX / srcScale;
        const sy = currentY / srcScale;
        const sw = cropW / srcScale;
        const sh = cropH / srcScale;

        ctxCrop.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, cropW, cropH);

        // 3. Optional 16px Patch Grid Overlay
        if (toggleGrid.checked) {
            ctxCrop.strokeStyle = "rgba(56, 189, 248, 0.35)";
            ctxCrop.lineWidth = 1;
            const p = 16;
            for (let x = 0; x <= cropW; x += p) {
                ctxCrop.beginPath();
                ctxCrop.moveTo(x, 0);
                ctxCrop.lineTo(x, cropH);
                ctxCrop.stroke();
            }
            for (let y = 0; y <= cropH; y += p) {
                ctxCrop.beginPath();
                ctxCrop.moveTo(0, y);
                ctxCrop.lineTo(cropW, y);
                ctxCrop.stroke();
            }
        }

        // 4. Update Mathematical Telemetry
        const rH = Math.sqrt(resH / resW);
        const rW = Math.sqrt(resW / resH);
        const centerX = currentX + cropW / 2;
        const centerY = currentY + cropH / 2;
        const posX = (centerX / resW) * (2 * rW) - rW;
        const posY = (centerY / resH) * (2 * rH) - rH;

        teleOffset.textContent =
            `(${Math.round(currentX)}, ${Math.round(currentY)})`;
        teleRH.textContent = rH.toFixed(3);
        teleRW.textContent = rW.toFixed(3);
        teleRoPE.textContent =
            `(${posX.toFixed(2)}, ${posY.toFixed(2)})`;
        if (teleStaticStatus) {
            const isStaticTrainShape =
                cropW === cropH && (cropW === 256 || cropW === 512);
            if (isStaticTrainShape) {
                teleStaticStatus.textContent = `Static ${cropW}×${cropH} (No JIT Break)`;
                teleStaticStatus.className = "text-success";
            } else if (cropW === cropH) {
                teleStaticStatus.textContent = `Square ${cropW}×${cropH} (Custom)`;
                teleStaticStatus.className = "text-accent";
            } else {
                teleStaticStatus.textContent = `Non-Square ${cropW}×${cropH} (Triggers Recompile)`;
                teleStaticStatus.className = "text-danger";
            }
        }
    }
}
// 7. Section 5.5: Latent-to-Pixel Adaptation & Clipping Inspector
function initPixelAdaptInspector() {
    const btnObj = document.getElementById("btnPixelObj");
    const btnPatch = document.getElementById("btnPixelPatch");
    const btnToyDiag = document.getElementById("btnPixelToyDiag");

    const paneObj = document.getElementById("panePixelObj");
    const panePatch = document.getElementById("panePixelPatch");
    const paneToyDiag = document.getElementById("panePixelToyDiag");

    const btnClipRaw = document.getElementById("btnClipRaw");
    const btnClipNaive = document.getElementById("btnClipNaive");
    const btnClipDynamic = document.getElementById("btnClipDynamic");

    const imgClipping = document.getElementById("imgClipping");
    const valClipDiag = document.getElementById("valClipDiag");
    const valClipDesc = document.getElementById("valClipDesc");

    if (!btnObj || !btnPatch || !btnToyDiag) return;

    function switchPixelTab(activeBtn, activePane) {
        [btnObj, btnPatch, btnToyDiag].forEach((b) =>
            b.classList.remove("active-preset")
        );
        [paneObj, panePatch, paneToyDiag].forEach((p) => {
            if (p) p.classList.add("hidden-pane");
        });
        activeBtn.classList.add("active-preset");
        if (activePane) activePane.classList.remove("hidden-pane");
    }

    btnObj.onclick = () => switchPixelTab(btnObj, paneObj);
    btnPatch.onclick = () => switchPixelTab(btnPatch, panePatch);
    btnToyDiag.onclick = () => switchPixelTab(btnToyDiag, paneToyDiag);

    const clipStates = {
        raw: {
            src: "images/comparisons/pixel_unclipped_grid.png",
            diag: "High-contrast blowout & color shift (FID > 50)",
            diagClass: "text-danger",
            desc:
                "Unbounded <i>x</i><sub>0</sub> predictions extrapolate past [-1, 1], " +
                "inducing severe chromatic shifts and contrast collapse as <i>t</i> &rarr; 0."
        },
        naive: {
            src: "images/comparisons/pixel_clamped_grid.png",
            diag: "Extreme values clamped; hue distortions remain (FID 19.85)",
            diagClass: "text-accent",
            desc:
                "Hard <code>clamp([-1, 1])</code> bounds dynamic range but rotates RGB " +
                "vector angles, distorting delicate anime color tones."
        },
        dynamic: {
            src: "images/comparisons/pixel_dynamic_clipped_grid.png",
            diag: "Preserved vector angles; still trails native v-pred (FID 14.39)",
            diagClass: "text-success",
            desc:
                "Dynamic percentile clipping rescales extreme vectors proportionally, " +
                "stabilizing toy-scale <i>x</i><sub>0</sub> runs—yet requires careful tuning " +
                "to avoid desaturation, motivating native <i>v</i>-prediction at 512<sup>2</sup>."
        }
    };

    function setClipMode(mode, activeBtn) {
        [btnClipRaw, btnClipNaive, btnClipDynamic].forEach((b) => {
            if (b) b.classList.remove("active-step");
        });
        if (activeBtn) activeBtn.classList.add("active-step");

        const data = clipStates[mode];
        if (imgClipping) imgClipping.src = data.src;
        if (valClipDiag) {
            valClipDiag.textContent = data.diag;
            valClipDiag.className = `c-val ${data.diagClass}`;
        }
        if (valClipDesc) valClipDesc.innerHTML = data.desc;
    }

    if (btnClipRaw) btnClipRaw.onclick = () => setClipMode("raw", btnClipRaw);
    if (btnClipNaive) btnClipNaive.onclick = () => setClipMode("naive", btnClipNaive);
    if (btnClipDynamic) btnClipDynamic.onclick = () => setClipMode("dynamic", btnClipDynamic);

    if (btnClipRaw) setClipMode("raw", btnClipRaw);
}

// Interactive VAE vs. Pixel Sampling Amortization Explorer
function initAmortizationExplorer() {
    const btn1024 = document.getElementById("btnAmort1024");
    const btn512 = document.getElementById("btnAmort512");
    const slider = document.getElementById("amortStepsSlider");
    const valSteps = document.getElementById("amortStepsVal");

    const outLatent = document.getElementById("amortLatentTime");
    const outLatentSub = document.getElementById("amortLatentBreakdown");
    const outPixel = document.getElementById("amortPixelTime");
    const outPixelSub = document.getElementById("amortPixelBreakdown");
    const outWinner = document.getElementById("amortWinnerVal");
    const outSub = document.getElementById("amortCrossoverSub");
    const barLatent = document.getElementById("amortBarLatent");
    const barPixel = document.getElementById("amortBarPixel");

    if (!btn1024 || !btn512 || !slider) return;

    // Exact empirical constants from Paper (NVIDIA A40, Batch B=16)
    const profiles = {
        "1024": {
            tStepLatent: 1.387,
            tFixedVae: 4.82,
            tStepPixel: 1.773,
            tFixedPixel: 0.09,
            maxRefTime: 53.28 // 30-step pixel time at 1024^2
        },
        "512": {
            tStepLatent: 0.181,
            tFixedVae: 0.56,
            tStepPixel: 0.260,
            tFixedPixel: 0.09,
            maxRefTime: 7.89 // 30-step pixel time at 512^2
        }
    };

    let activeRes = "1024";

    function update() {
        const N = parseInt(slider.value, 10);
        const p = profiles[activeRes];

        const tLatent = N * p.tStepLatent + p.tFixedVae;
        const tPixel = N * p.tStepPixel + p.tFixedPixel;
        const nStar = (p.tFixedVae - p.tFixedPixel) / (p.tStepPixel - p.tStepLatent);

        valSteps.textContent = N;
        outLatent.textContent = `${tLatent.toFixed(2)} s`;
        outLatentSub.textContent =
            `${N} × ${p.tStepLatent.toFixed(3)}s + ${p.tFixedVae.toFixed(2)}s VAE`;

        outPixel.textContent = `${tPixel.toFixed(2)} s`;
        outPixelSub.textContent =
            `${N} × ${p.tStepPixel.toFixed(3)}s + ${p.tFixedPixel.toFixed(2)}s fixed`;

        if (tPixel < tLatent) {
            const speedup = (tLatent / tPixel).toFixed(2);
            outWinner.textContent = `Pixel ${speedup}× Faster`;
            outWinner.className = "metric-val text-success";
            outSub.textContent = `Few-step regime (N < ${nStar.toFixed(2)})`;
        } else {
            const slowerPct = (((tPixel - tLatent) / tLatent) * 100).toFixed(1);
            outWinner.textContent = `Latent Faster (+${slowerPct}% Pixel)`;
            outWinner.className = "metric-val text-accent";
            outSub.textContent = `Multi-step amortized (N > ${nStar.toFixed(2)})`;
        }

        const wLatent = Math.min(100, (tLatent / p.maxRefTime) * 100);
        const wPixel = Math.min(100, (tPixel / p.maxRefTime) * 100);
        if (barLatent) barLatent.style.width = `${wLatent.toFixed(1)}%`;
        if (barPixel) barPixel.style.width = `${wPixel.toFixed(1)}%`;
    }

    btn1024.onclick = () => {
        activeRes = "1024";
        btn1024.classList.add("active-pill");
        btn512.classList.remove("active-pill");
        update();
    };

    btn512.onclick = () => {
        activeRes = "512";
        btn512.classList.add("active-pill");
        btn1024.classList.remove("active-pill");
        update();
    };

    slider.addEventListener("input", update);
    update();
}
// Section 3: Benchmarks Switcher
function initBenchmarkTabs() {
    const tabBar = document.getElementById("benchmarkTabs");
    if (!tabBar) return;

    const buttons = tabBar.querySelectorAll("[data-bench-tab]");
    const panes = document.querySelectorAll("#benchmarks .bench-pane");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.benchTab;

            buttons.forEach((b) => {
                b.classList.remove("active-preset");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active-preset");
            btn.setAttribute("aria-selected", "true");

            panes.forEach((pane) => {
                if (pane.id === targetId) {
                    pane.classList.remove("hidden-pane");
                } else {
                    pane.classList.add("hidden-pane");
                }
            });
        });
    });
}
function initBibtexCopy() {
    const btnCopy = document.getElementById("btnCopyBibtex");
    const bibBlock = document.getElementById("bibtexCode");
    if (!btnCopy || !bibBlock) return;

    btnCopy.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(bibBlock.textContent);
            btnCopy.textContent = "Copied!";
            setTimeout(() => {
                btnCopy.textContent = "Copy BibTeX";
            }, 1800);
        } catch {
            btnCopy.textContent = "Select & Copy";
        }
    });
}