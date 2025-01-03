import datetime
import select
import socket
import common_ports
import ipaddress
from datetime import datetime



def get_open_ports(target, port_range, verbose = False):
    open_ports = []
    
    # Add Banner 
    print("-" * 50)
    print("Scanning Target: " + target)
    print("Scanning started at:" + str(datetime.now()))
    print("-" * 50)
    
    socket.setdefaulttimeout(1)
    
    try:
        if target[0].isalpha():
            ip = socket.gethostbyname(target)
        else:
            try:
                if ipaddress.ip_address(target) :
                    ip = target
                    
                    try:
                        target_host = socket.gethostbyaddr(ip)
                        target_host = target_host[0]
                        if target_host[0].isalpha():
                            target = target_host
                            
                    except socket.herror:
                        pass
                    
            except ValueError:
                return "Error: Invalid IP address"
            
    except socket.gaierror:
        return "Error: Invalid hostname"
    
    
    if verbose:
          
        if not target[0].isalpha():
            ans = f"Open ports for {ip}\nPORT     SERVICE\n"
        else:
            ans = f"Open ports for {target} ({ip})\nPORT     SERVICE\n"
        
    for port in range(port_range[0], port_range[1] + 1):
        
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        
        
        try:
            result = s.connect_ex((ip, int(port)))
           
            if result == 0:
                if verbose : 
                    ans += f"{port:<9}{common_ports.ports_and_services[port]}\n"
                else:
                    open_ports.append(port)
        
               
        except Exception as e:
            if target[0].isalpha():
                return "Error: Invalid hostname"
            return "Error: Invalid IP address"
        
       
            
        s.close()
       
    if not verbose:    
        return(open_ports)
    
    return ans.strip()
    
    
    
