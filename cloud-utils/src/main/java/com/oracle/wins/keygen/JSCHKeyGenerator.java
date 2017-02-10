package com.oracle.wins.keygen;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.KeyPair;

public class JSCHKeyGenerator {

	/**
	 * Generates keypair using passphrase and write the private key to file
	 * @param privateKeyFileName
	 * @param passphrase
	 * @return public key
	 */
	@SuppressWarnings("deprecation")
	public static String generateKeys (String privateKeyFileName, String passphrase) {
		String response = null;

		try {
			JSch jsch = new JSch();

			KeyPair kpair = KeyPair.genKeyPair(jsch, KeyPair.RSA, 2048);

			if (passphrase != null && passphrase.length() > 0) {
				kpair.setPassphrase(passphrase.getBytes(StandardCharsets.UTF_8));
			}

			kpair.writePrivateKey(privateKeyFileName);

			byte[] pub = Base64.getEncoder().encode(kpair.getPublicKeyBlob());

			response = new String(pub);
			kpair.dispose();
		} catch (IOException | JSchException e) {
			response = "Failure during keypair generation. " + e.getMessage();
			e.printStackTrace();
		}
		return response;
	}

}
