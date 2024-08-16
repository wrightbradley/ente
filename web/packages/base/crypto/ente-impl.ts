/** Careful when adding add other imports! */
import * as libsodium from "./libsodium";
import type {
    DecryptBlobB64,
    DecryptBoxB64,
    DecryptBoxBytes,
    EncryptB64,
    EncryptBytes,
    EncryptedBlobB64,
    EncryptedBlobBytes,
    EncryptJSON,
} from "./types";

const EncryptB64ToBytes = async ({
    dataB64,
    keyB64,
}: EncryptB64): Promise<EncryptBytes> => ({
    data: await libsodium.fromB64(dataB64),
    keyB64,
});

const EncryptedBlobBytesToB64 = async ({
    encryptedData,
    decryptionHeaderB64,
}: EncryptedBlobBytes): Promise<EncryptedBlobB64> => ({
    encryptedDataB64: await libsodium.toB64(encryptedData),
    decryptionHeaderB64,
});

export const _encryptBoxB64 = (r: EncryptB64) =>
    EncryptB64ToBytes(r).then((rb) => libsodium.encryptBox(rb));

export const _encryptAssociatedData = libsodium.encryptBlob;

export const _encryptThumbnail = _encryptAssociatedData;

export const _encryptAssociatedDataB64 = (r: EncryptBytes) =>
    _encryptAssociatedData(r).then(EncryptedBlobBytesToB64);

export const _encryptMetadataJSON = ({ jsonValue, keyB64 }: EncryptJSON) =>
    _encryptAssociatedDataB64({
        data: new TextEncoder().encode(JSON.stringify(jsonValue)),
        keyB64,
    });

const DecryptBoxB64ToBytes = async ({
    encryptedDataB64,
    nonceB64,
    keyB64,
}: DecryptBoxB64): Promise<DecryptBoxBytes> => ({
    encryptedData: await libsodium.fromB64(encryptedDataB64),
    nonceB64,
    keyB64,
});

export const _decryptBoxB64 = (r: DecryptBoxB64) =>
    DecryptBoxB64ToBytes(r).then((rb) => libsodium.decryptBox(rb));

export const _decryptAssociatedData = libsodium.decryptBlob;

export const _decryptThumbnail = _decryptAssociatedData;

export const _decryptAssociatedDataB64 = async ({
    encryptedDataB64,
    decryptionHeaderB64,
    keyB64,
}: DecryptBlobB64) =>
    await _decryptAssociatedData({
        encryptedData: await libsodium.fromB64(encryptedDataB64),
        decryptionHeaderB64,
        keyB64,
    });

export const _decryptMetadataJSON = async (r: DecryptBlobB64) =>
    JSON.parse(
        new TextDecoder().decode(await _decryptAssociatedDataB64(r)),
    ) as unknown;