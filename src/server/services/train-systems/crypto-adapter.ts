// Crypto adapter that works in both Node.js and Workers runtime

interface CryptoAdapter {
  pbkdf2(key: string, salt: Uint8Array, iterations: number, keylen: number): Promise<Uint8Array>
  decryptAes128Cbc(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array>
}

class NodeCryptoAdapter implements CryptoAdapter {
  async pbkdf2(key: string, salt: Uint8Array, iterations: number, keylen: number): Promise<Uint8Array> {
    const { pbkdf2 } = await import('node:crypto')
    return new Promise((resolve, reject) => {
      pbkdf2(key, salt, iterations, keylen, 'sha1', (err, derivedKey) => {
        if (err) reject(err)
        else resolve(new Uint8Array(derivedKey))
      })
    })
  }

  async decryptAes128Cbc(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const { createDecipheriv } = await import('node:crypto')
    const decipher = createDecipheriv('aes-128-cbc', key, iv)
    decipher.setAutoPadding(true)
    const result = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ])
    return new Uint8Array(result)
  }
}

class WebCryptoAdapter implements CryptoAdapter {
  async pbkdf2(key: string, salt: Uint8Array, iterations: number, keylen: number): Promise<Uint8Array> {
    const encoder = new TextEncoder()
    const keyBuffer = encoder.encode(key)
    
    const importedKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    )
    
    const derivedKeyBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-1'
      },
      importedKey,
      keylen * 8
    )
    
    return new Uint8Array(derivedKeyBuffer)
  }

  async decryptAes128Cbc(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const aesKey = await crypto.subtle.importKey(
      'raw',
      key,
      'AES-CBC',
      false,
      ['decrypt']
    )
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv
      },
      aesKey,
      data
    )
    
    return new Uint8Array(decrypted)
  }
}

// Detect runtime and return appropriate adapter
export function getCryptoAdapter(): CryptoAdapter {
  // Check if we're in Workers runtime
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof process === 'undefined') {
    return new WebCryptoAdapter()
  }
  // Otherwise, assume Node.js runtime
  return new NodeCryptoAdapter()
}