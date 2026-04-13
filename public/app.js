
const address = "0x2";

const ABI = "your ABI";

let provider, signer, contract;

function loading(status) {
    const elm = document.querySelector(".loading");
    if (elm) {
        status ? elm.classList.remove("d-none") : elm.classList.add("d-none");
    }
}

async function connectWallet() {
    if (!window.ethereum) {
        return alert("Dompet crypto tidak ditemukan! Instal MetaMask.");
    }
    
    try {
        loading(true);
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        
        // Inisialisasi Kontrak
        contract = new ethers.Contract(address, ABI, signer);

        const [clientAddr, designerAddr] = await Promise.all([
            contract.client(),
            contract.designer()
        ]);

        document.getElementById("display-akun").innerText = signer.address;
        document.getElementById("display-client").innerText = clientAddr;
        document.getElementById("display-designer").innerText = designerAddr;

        await loadStatus();
        await loadBalance();

        document.getElementById("view-1").classList.add("d-none");
        document.getElementById("view-2").classList.remove("d-none");
    } catch (err) {
        console.error(err);
        alert("Gagal koneksi wallet");
    } finally {
        loading(false);
    }
}

async function loadStatus() {
    const _status = await contract.status();
    const statusMap = ["Created", "Funded", "Delivered", "Released", "Refunded"];
    
    document.getElementById("display-status").innerText = statusMap[Number(_status)];
}

async function loadBalance() {
    const saldoWei = await provider.getBalance(address);
    document.getElementById("display-saldo").innerText = ethers.formatEther(saldoWei) + ' ETH';
}

// Handler untuk Tombol Fund
document.getElementById("btn-fund").onclick = async () => {
    const amount = document.getElementById("amount").value;
    if (!amount) return alert("Isi jumlah ETH");

    try {
        loading(true);
        const tx = await contract.fundEscrow({
            value: ethers.parseEther(amount)
        });
        await tx.wait();
        alert("Pembayaran berhasil masuk Escrow!");
        await updateUI();
    } catch (err) {
        errorHandling(err);
    } finally {
        loading(false);
    }
};

// Handler untuk Tombol Delivered (Desainer)
document.getElementById("btn-delivered").onclick = async () => {
    try {
        loading(true);
        const tx = await contract.markAsDelivered();
        await tx.wait();
        await updateUI();
    } catch (err) {
        errorHandling(err);
    } finally {
        loading(false);
    }
};

// Handler untuk Tombol Release (Klien)
document.getElementById("btn-release").onclick = async () => {
    try {
        loading(true);
        const tx = await contract.releasePayment();
        await tx.wait();
        await updateUI();
    } catch (err) {
        errorHandling(err);
    } finally {
        loading(false);
    }
};

// Helper untuk update UI setelah transaksi
async function updateUI() {
    await loadStatus();
    await loadBalance();
}

function errorHandling(err) {
    console.error("Detail Error:", err);
    // Mengambil pesan error dari smart contract (require)
    const reason = err.reason || (err.error && err.error.message) || err.message;
    alert("Transaksi Gagal: " + reason);
}

document.getElementById("btn-refund").onclick = async () => {
    try {
        loading(true);
        const tx = await contract.refundClient();
        await tx.wait();
        await updateUI();
    } catch (err) {
        errorHandling(err);
    } finally {
        loading(false);
    }
}

document.getElementById("btn-cancel").onclick = async () => {
    try {
        loading(true);
        const tx = await contract.cancelEscrow();
        await tx.wait();
        await updateUI();
    } catch (err) {
        errorHandling(err);
    } finally {
        loading(false);
    }
}

document.getElementById("btn-reset").onclick = async () => {
    try {
        loading(true);
        const tx = await contract.resetEscrow();
        await tx.wait();
        await updateUI();
    } catch (err) {
        errorHandling(err);
    } finally {
        loading(false);
    }
}