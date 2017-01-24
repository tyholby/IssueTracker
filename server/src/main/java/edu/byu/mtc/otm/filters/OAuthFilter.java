package edu.byu.mtc.otm.filters;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;
import java.util.logging.Logger;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

import org.apache.amber.oauth2.common.exception.OAuthProblemException;
import org.apache.amber.oauth2.common.exception.OAuthRuntimeException;
import org.apache.amber.oauth2.common.exception.OAuthSystemException;
import org.apache.amber.oauth2.common.message.types.ParameterStyle;
import org.apache.amber.oauth2.rs.request.OAuthAccessResourceRequest;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;


public class OAuthFilter implements Filter {
	private Logger logger = Logger.getLogger(this.getClass().getName());
	protected ObjectMapper mapper = new ObjectMapper();
	protected String scope = null;
	protected String unauthenticatedAccess = "false";
	protected String tokenInfoEndpoint;
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		tokenInfoEndpoint = filterConfig.getInitParameter("tokenInfoEndpoint");
		if(tokenInfoEndpoint == null){
			logger.warning("YOU DID NOT SET A TOKEN INFO ENDPOINT FOR THE OAUTHFILTER.. CAN IT BE FOUND VIA CONTEXT?");
			//Try to grab it from the context file
			try {
				tokenInfoEndpoint = (String) new InitialContext().lookup("java:comp/env/tokenInfoEndpoint");
				logger.warning("SUCCESSFULLY FOUND A TOKEN INFO ENDPOINT THROUGH THE CONTEXT: " + tokenInfoEndpoint);
			} catch (NamingException e) {
				tokenInfoEndpoint = "https://auth.mtc.byu.edu/oauth2/tokeninfo";
				logger.warning("COULDN'T FIND TOKEN INFO ENPOINT, DEFAULTED TO " + tokenInfoEndpoint);
			}
		}
		scope = filterConfig.getInitParameter("scope");
		if(filterConfig.getInitParameter("unauthenticatedAccess") != null)
			unauthenticatedAccess = filterConfig.getInitParameter("unauthenticatedAccess");
		else
			unauthenticatedAccess = "false";
		
		logger.info("OAuth Filter Initialized");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		try{
			//Grab the access token off the request headers
			OAuthAccessResourceRequest oauthRequest = new OAuthAccessResourceRequest((HttpServletRequest) request, ParameterStyle.HEADER);
			String accessToken = oauthRequest.getAccessToken();
			//Make a call to the verification url
			TokenInformation info = validateToken(accessToken);
			if(info == null)
				throw new OAuthSystemException("No Token Information");
			//Fail if there is not a matching scope for this request
			List<String> scopes = Arrays.asList(info.getScope().split("\\s*\\s\\s*"));
			if(scope != null && !scopes.contains(scope))
				throw new OAuthRuntimeException("Token doesn't contain the required scope");
			request.setAttribute("accessToken", oauthRequest.getAccessToken());
			
			//Wrap the token up in the request so that the information can be utilized by methods
			UserRoleRequestWrapper wrapper = new UserRoleRequestWrapper((HttpServletRequest) request, info);
			chain.doFilter(wrapper, response);
		}catch (OAuthSystemException | OAuthProblemException e){
			//Wreck Hard?
			if(unauthenticatedAccess.equals("true")){
				chain.doFilter(request, response);
			}else{
				if(((HttpServletRequest)request).getMethod().equals("OPTIONS")){
					chain.doFilter(request, response);
				} else{
					((HttpServletResponse)response).sendError(401, e.getMessage());
					return;
				}
			}
			logger.finer(e.getMessage());
		}
	}

	@Override
	public void destroy() {
		logger.info("OAuth Filter Destroyed");
	}
	
	protected TokenInformation validateToken(String accessToken) throws OAuthSystemException{
		TokenInformation info = null;
		URL url = null;
		HttpURLConnection connection = null;
		try {
			url = new URL(tokenInfoEndpoint + "?access_token=" + accessToken);
			connection = (HttpURLConnection)url.openConnection();
		}catch (MalformedURLException e){
			throw new OAuthSystemException(e);
		}catch (IOException e){
			throw new OAuthSystemException(e);
		}
		
		try(InputStream in = new BufferedInputStream(connection.getInputStream())){
			info = mapper.readValue(in, TokenInformation.class);
		}catch (JsonParseException e) {
			throw new OAuthSystemException(e);
		}catch (JsonMappingException e) {
			throw new OAuthSystemException(e);
		}catch(IOException e) {
			String errormessage = "";
			try{
				if(connection.getResponseCode() != 200)
				try(InputStream in = connection.getErrorStream()){
					errormessage = new Scanner(in,"UTF-8").useDelimiter("\\A").next();
					throw new OAuthSystemException(errormessage);
				}catch(IOException ie) {
					throw new OAuthSystemException(ie);
				}
			}catch(IOException ie) {
				throw new OAuthSystemException(e);
			}
			throw new RuntimeException(errormessage, e);
		}finally{
			connection.disconnect();
		}
		return info;
	}
	
	public class UserRoleRequestWrapper extends HttpServletRequestWrapper {
		public UserRoleRequestWrapper(HttpServletRequest request, TokenInformation information) {
			super(request);
			request.setAttribute("tokenInformation", information);
			request.setAttribute("environment", information.getEnvironment());
			request.setAttribute("userid", information.getUser().getId());
			request.setAttribute("byuid", information.getUser().getByuId());
			request.setAttribute("byupersonid", information.getUser().getByuPersonId());
			request.setAttribute("username", information.getUser().getName());
			request.setAttribute("audience", information.getAudience());
			request.setAttribute("type", information.getType());
			if(information.getOriginalUserId() != null && !information.getOriginalUserId().equals(""))
				request.setAttribute("originalUserId", information.getOriginalUserId());
		}
		
		@Override
		public boolean isUserInRole(String role) {
			TokenInformation info = (TokenInformation)getRequest().getAttribute("tokenInformation");
			if(info == null || info.getUser() == null || info.getUser().getRoles() == null){
				return ((HttpServletRequest)getRequest()).isUserInRole(role);
			}
			return info.getUser().getRoles().contains(role);
		}

		@Override
		public Principal getUserPrincipal() {
			final TokenInformation info = (TokenInformation)getRequest().getAttribute("tokenInformation");
			if(info == null || info.getUser() == null || info.getUser().getId() == null){
				return ((HttpServletRequest)getRequest()).getUserPrincipal();
			}

			// make an anonymous implementation to just return our user
			return new Principal() {
				@Override
				public String getName() {
					return info.getUser().getId();
				}
				
				@Override
				public String toString() {
					return info.getUser().getId();
				}
			};
		}
	}
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class TokenInformation {
		protected User user;
		protected String audience;
		protected String expires_in;
		protected String scope;
		protected String environment;
		protected String originalUserId;
		protected String type;
		
		public User getUser() {
			return user;
		}
		public void setUser(User user) {
			this.user = user;
		}
		public String getAudience() {
			return audience;
		}
		public void setAudience(String audience) {
			this.audience = audience;
		}
		public String getExpires_in() {
			return expires_in;
		}
		public void setExpires_in(String expires_in) {
			this.expires_in = expires_in;
		}
		public String getScope() {
			return scope;
		}
		public void setScope(String scope) {
			this.scope = scope;
		}
		public String getEnvironment() {
			return environment;
		}
		public void setEnvironment(String environment) {
			this.environment = environment;
		}
		public String getOriginalUserId() {
			return originalUserId;
		}
		public void setOriginalUserId(String originalUserId) {
			this.originalUserId = originalUserId;
		}
		public String getType() {
			return type;
		}
		public void setType(String type) {
			this.type = type;
		}
	}
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class User {
		protected String id;
		protected String name;
		protected String preferredLanguage;
		protected String country;
		protected String locale;
		protected String byuId;
		protected String byuPersonId;
		protected String googleId;
		protected Set<String> roles;
		protected Map<String,String> attributes;
		
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getPreferredLanguage() {
			return preferredLanguage;
		}
		public void setPreferredLanguage(String preferredLanguage) {
			this.preferredLanguage = preferredLanguage;
		}
		public String getCountry() {
			return country;
		}
		public void setCountry(String country) {
			this.country = country;
		}
		public String getLocale() {
			return locale;
		}
		public void setLocale(String locale) {
			this.locale = locale;
		}
		public String getByuId() {
			return byuId;
		}
		public void setByuId(String byuId) {
			this.byuId = byuId;
		}
		public String getByuPersonId() {
			return byuPersonId;
		}
		public void setByuPersonId(String byuPersonId) {
			this.byuPersonId = byuPersonId;
		}
		public String getGoogleId() {
			return googleId;
		}
		public void setGoogleId(String googleId) {
			this.googleId = googleId;
		}
		public Set<String> getRoles() {
			return roles;
		}
		public void setRoles(Set<String> roles) {
			this.roles = roles;
		}
		public Map<String, String> getAttributes() {
			return attributes;
		}
		public void setAttributes(Map<String, String> attributes) {
			this.attributes = attributes;
		}
	}
}
